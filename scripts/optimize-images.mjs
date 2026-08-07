import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const sourceImageExtensions = new Set([".jpeg", ".jpg", ".png", ".webp"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".txt", ".webmanifest", ".xml"]);
const preservedFiles = new Set(["assets/lunadeermc-brand-logo.png"]);
const workerCount = Math.max(1, Math.min(availableParallelism() || 1, 8));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }

  return files;
}

async function runWithConcurrency(items, limit, task) {
  let nextIndex = 0;
  const results = new Array(items.length);
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await task(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function toPosixPath(path) {
  return path.split(sep).join("/");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

function logBuildMessage(logger, message) {
  if (logger && typeof logger.info === "function") logger.info(message);
  else console.log(`[image-optimization] ${message}`);
}

function addAsyncImageAttributes(source) {
  return source.replace(/<img\b([^>]*?)>/gi, (_match, rawAttributes) => {
    let attributes = rawAttributes.replace(/\s*\/\s*$/, "");
    if (!/\bloading\s*=/.test(attributes)) attributes += ' loading="lazy"';
    if (!/\bdecoding\s*=/.test(attributes)) attributes += ' decoding="async"';
    return `<img${attributes}>`;
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findReferencedAvifSources(documents, imageFiles, outputDirectory) {
  const imagePathByUrl = new Map();
  for (const imagePath of imageFiles) {
    imagePathByUrl.set(`/${toPosixPath(relative(outputDirectory, imagePath))}`, imagePath);
  }

  const neededSources = new Set();
  const avifReferencePattern = /\/assets\/[^"'#? )]+\.avif/g;

  for (const { content } of documents) {
    for (const match of content.matchAll(avifReferencePattern)) {
      const baseUrl = match[0].slice(0, -".avif".length);
      for (const extension of sourceImageExtensions) {
        const sourcePath = imagePathByUrl.get(`${baseUrl}${extension}`);
        if (sourcePath) {
          neededSources.add(sourcePath);
          break;
        }
      }
    }
  }

  return neededSources;
}

export async function optimizeImages(outputDirectory, logger) {
  sharp.concurrency(workerCount);

  const assetsDirectory = join(outputDirectory, "assets");
  const allFiles = await walk(outputDirectory);
  const assetFiles = allFiles.filter((path) => path === assetsDirectory || path.startsWith(`${assetsDirectory}${sep}`));
  const imageFiles = assetFiles.filter((path) => sourceImageExtensions.has(extname(path).toLowerCase()));
  const textFiles = allFiles.filter((path) => textExtensions.has(extname(path).toLowerCase()));

  const textDocuments = await runWithConcurrency(textFiles, workerCount, async (path) => ({
    path,
    content: await readFile(path, "utf8"),
  }));

  const referencedAvifSources = findReferencedAvifSources(textDocuments, imageFiles, outputDirectory);

  const webpJobs = [];
  for (const sourcePath of imageFiles) {
    const relativePath = toPosixPath(relative(outputDirectory, sourcePath));
    if (preservedFiles.has(relativePath)) continue;
    if (extname(sourcePath).toLowerCase() === ".webp") continue;
    webpJobs.push({ sourcePath, relativePath });
  }

  const webpResults = await runWithConcurrency(webpJobs, workerCount, async ({ sourcePath, relativePath }) => {
    const sourceStats = await stat(sourcePath);
    const webpPath = sourcePath.slice(0, -extname(sourcePath).length) + ".webp";
    const webpRelativePath = toPosixPath(relative(outputDirectory, webpPath));
    await sharp(sourcePath, { failOn: "none" })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(webpPath);
    const webpBytes = (await stat(webpPath)).size;

    if (webpBytes < sourceStats.size) {
      return { sourcePath, relativePath, webpRelativePath, webpBytes, sourceStats, webpReplacesSource: true };
    }
    await unlink(webpPath);
    return { sourcePath, relativePath, webpRelativePath: null, webpBytes: null, sourceStats, webpReplacesSource: false };
  });

  const replacements = new Map();
  const fallbackAvifSources = new Set();
  let sourceBytes = 0;
  let optimizedBytes = 0;
  let convertedCount = 0;

  for (const result of webpResults) {
    const sourceUrl = `/${result.relativePath}`;
    if (result.webpReplacesSource) {
      replacements.set(sourceUrl, `/${result.webpRelativePath}`);
      sourceBytes += result.sourceStats.size;
      optimizedBytes += result.webpBytes;
      convertedCount += 1;
    } else {
      fallbackAvifSources.add(result.sourcePath);
    }
  }

  const avifSources = new Set();
  for (const sourcePath of referencedAvifSources) {
    const relativePath = toPosixPath(relative(outputDirectory, sourcePath));
    if (!preservedFiles.has(relativePath)) avifSources.add(sourcePath);
  }
  for (const sourcePath of fallbackAvifSources) {
    const relativePath = toPosixPath(relative(outputDirectory, sourcePath));
    if (!preservedFiles.has(relativePath)) avifSources.add(sourcePath);
  }

  const avifResults = await runWithConcurrency([...avifSources], workerCount, async (sourcePath) => {
    const sourceStats = await stat(sourcePath);
    const avifPath = sourcePath.slice(0, -extname(sourcePath).length) + ".avif";
    const avifRelativePath = toPosixPath(relative(outputDirectory, avifPath));
    await sharp(sourcePath, { failOn: "none" })
      .avif({ quality: 55, effort: 6 })
      .toFile(avifPath);
    const avifBytes = (await stat(avifPath)).size;
    return { sourcePath, avifRelativePath, avifBytes, sourceStats };
  });

  for (const result of avifResults) {
    const sourceUrl = `/${toPosixPath(relative(outputDirectory, result.sourcePath))}`;
    if (!replacements.has(sourceUrl) && result.avifBytes < result.sourceStats.size) {
      replacements.set(sourceUrl, `/${result.avifRelativePath}`);
      sourceBytes += result.sourceStats.size;
      optimizedBytes += result.avifBytes;
      convertedCount += 1;
    }
  }

  const keys = [...replacements.keys()].sort((a, b) => b.length - a.length);
  const replacementPattern =
    keys.length > 0 ? new RegExp(keys.map((key) => escapeRegExp(key)).join("|"), "g") : null;

  await runWithConcurrency(textDocuments, workerCount, async ({ path, content }) => {
    let rewritten = content;
    if (replacementPattern && content.includes("/assets")) {
      rewritten = content.replace(replacementPattern, (match) => replacements.get(match));
    }
    if (extname(path).toLowerCase() === ".html") rewritten = addAsyncImageAttributes(rewritten);
    if (rewritten !== content) await writeFile(path, rewritten);
  });

  logBuildMessage(
    logger,
    `generated ${convertedCount} WebP/AVIF replacements and ${avifResults.length} AVIF variants; references reduced by ${formatBytes(sourceBytes - optimizedBytes)}`,
  );
}

export default function optimizeImagesIntegration() {
  return {
    name: "lunadeermc-image-optimization",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await optimizeImages(fileURLToPath(dir), logger);
      },
    },
  };
}
