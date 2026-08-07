#!/usr/bin/env node

import { createHash, createHmac } from "node:crypto";
import { request as httpsRequest } from "node:https";

const apiHost = process.env.EO_API_HOST || "teo.tencentcloudapi.com";
const apiVersion = "2022-09-01";
const service = "teo";

const secretId = process.env.EO_SECRETID || process.env.TENCENTCLOUD_SECRET_ID;
const secretKey = process.env.EO_SECRETKEY || process.env.TENCENTCLOUD_SECRET_KEY;
const domain = process.env.EO_PURGE_DOMAIN || "mc.lunadeer.cn";
const purgeType = process.env.EO_PURGE_TYPE || "purge_host";
const purgeMethod = process.env.EO_PURGE_METHOD || "invalidate";
const explicitZoneId = process.env.EO_ZONE_ID || "";
const dryRun = process.env.EO_DRY_RUN === "1";

if (!secretId || !secretKey) {
  console.error("Missing EO_SECRETID / EO_SECRETKEY (or TENCENTCLOUD_SECRET_ID / TENCENTCLOUD_SECRET_KEY).");
  process.exit(1);
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hmacSha256(key, value) {
  return createHmac("sha256", key).update(value).digest();
}

function signRequest(action, payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = "application/json; charset=utf-8";

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${apiHost}\n` +
    `x-tc-action:${action.toLowerCase()}\n`;
  const signedHeaders = "content-type;host;x-tc-action";

  const canonicalRequest =
    "POST\n" +
    "/\n" +
    "\n" +
    canonicalHeaders +
    "\n" +
    signedHeaders +
    "\n" +
    sha256Hex(payload);

  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign =
    "TC3-HMAC-SHA256\n" +
    `${timestamp}\n` +
    `${credentialScope}\n` +
    sha256Hex(canonicalRequest);

  const secretDate = hmacSha256(`TC3${secretKey}`, date);
  const secretService = hmacSha256(secretDate, service);
  const secretSigning = hmacSha256(secretService, "tc3_request");
  const signature = hmacSha256(secretSigning, stringToSign).toString("hex");

  return {
    authorization:
      `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    timestamp,
  };
}

function callTencentApi(action, params) {
  const payload = JSON.stringify(params);
  const { authorization, timestamp } = signRequest(action, payload);
  const headers = {
    Authorization: authorization,
    "Content-Type": "application/json; charset=utf-8",
    Host: apiHost,
    "X-TC-Action": action,
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Version": apiVersion,
  };

  if (dryRun) {
    console.log(`[dry-run] POST https://${apiHost}/ Action=${action}`);
    console.log(`[dry-run] ${payload}`);
    return Promise.resolve({ dryRun: true });
  }

  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      {
        hostname: apiHost,
        port: 443,
        path: "/",
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const rawBody = Buffer.concat(chunks).toString("utf8");
          let body;
          try {
            body = JSON.parse(rawBody);
          } catch {
            reject(new Error(`Invalid JSON response (HTTP ${res.statusCode}): ${rawBody}`));
            return;
          }

          const response = body.Response;
          if (!response || response.Error) {
            const error = response?.Error || {};
            reject(
              new Error(
                `Tencent API ${action} failed: ${error.Code || "UnknownError"} ${error.Message || ""}` +
                  (response?.RequestId ? ` (RequestId: ${response.RequestId})` : "")
              )
            );
            return;
          }

          resolve(response);
        });
      }
    );

    req.on("error", reject);
    req.end(payload);
  });
}

async function resolveZoneId() {
  if (explicitZoneId) {
    return explicitZoneId;
  }

  const filtered = await callTencentApi("DescribeZones", {
    Filters: [{ Name: "zone-name", Values: [domain], Fuzzy: false }],
    Limit: 100,
  });

  let zones = filtered.Zones || [];
  if (zones.length === 0) {
    const allZones = await callTencentApi("DescribeZones", { Limit: 100 });
    zones = allZones.Zones || [];
  }

  const zone = zones.find((item) => item.ZoneName === domain);
  if (!zone?.ZoneId) {
    throw new Error(
      `Could not find EdgeOne zone for "${domain}". ` +
        "Set EO_ZONE_ID to provide the zone ID explicitly."
    );
  }

  console.log(`Resolved EdgeOne zone: ${domain} -> ${zone.ZoneId}`);
  return zone.ZoneId;
}

async function createPurgeTask(zoneId) {
  const params = {
    Type: purgeType,
    ZoneId: zoneId,
  };

  if (purgeType === "purge_host") {
    params.Targets = [domain];
  } else if (purgeType === "purge_url") {
    params.Targets = [`https://${domain}/`];
  }

  if (purgeMethod && ["purge_prefix", "purge_host", "purge_all"].includes(purgeType)) {
    params.Method = purgeMethod;
  }

  const response = await callTencentApi("CreatePurgeTask", params);
  if (response.dryRun) {
    return;
  }

  if (response.FailedList?.length) {
    throw new Error(
      `CreatePurgeTask reported failures: ${JSON.stringify(response.FailedList)} ` +
        `(RequestId: ${response.RequestId})`
    );
  }

  console.log(
    `EdgeOne cache purge submitted: JobId=${response.JobId}, RequestId=${response.RequestId}`
  );
}

try {
  const zoneId = await resolveZoneId();
  await createPurgeTask(zoneId);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
