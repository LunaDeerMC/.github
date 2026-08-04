import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rasterExtensions = new Set([".jpeg", ".jpg", ".png"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".txt", ".webmanifest", ".xml"]);
const preservedFiles = new Set(["assets/lunadeermc-brand-logo.png"]);

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

async function optimizeImages(outputDirectory, logger) {
  const assetsDirectory = join(outputDirectory, "assets");
  const allFiles = await walk(outputDirectory);
  const assetFiles = allFiles.filter((path) => path === assetsDirectory || path.startsWith(`${assetsDirectory}${sep}`));
  const imageFiles = assetFiles.filter((path) => rasterExtensions.has(extname(path).toLowerCase()));
  const replacements = new Map();
  let sourceBytes = 0;
  let optimizedBytes = 0;
  let convertedCount = 0;

  for (const sourcePath of imageFiles) {
    const relativePath = toPosixPath(relative(outputDirectory, sourcePath));
    if (preservedFiles.has(relativePath)) continue;

    const sourceStats = await stat(sourcePath);
    const sourceExtension = extname(sourcePath);
    const webpPath = sourcePath.slice(0, -sourceExtension.length) + ".webp";
    const webpRelativePath = toPosixPath(relative(outputDirectory, webpPath));

    await sharp(sourcePath, { failOn: "none" })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(webpPath);

    const webpStats = await stat(webpPath);
    if (webpStats.size >= sourceStats.size) {
      await unlink(webpPath);
      continue;
    }

    sourceBytes += sourceStats.size;
    optimizedBytes += webpStats.size;
    convertedCount += 1;
    replacements.set(`/${relativePath}`, `/${webpRelativePath}`);
  }

  if (replacements.size > 0) {
    const textFiles = allFiles.filter((path) => textExtensions.has(extname(path).toLowerCase()));
    const orderedReplacements = [...replacements.entries()].sort(([a], [b]) => b.length - a.length);

    for (const textPath of textFiles) {
      const source = await readFile(textPath, "utf8");
      const rewritten = orderedReplacements.reduce(
        (content, [from, to]) => content.split(from).join(to),
        source,
      );
      if (rewritten !== source) await writeFile(textPath, rewritten);
    }
  }

  logBuildMessage(
    logger,
    convertedCount > 0
      ? `converted ${convertedCount} image${convertedCount === 1 ? "" : "s"} to WebP; loaded assets reduced by ${formatBytes(sourceBytes - optimizedBytes)}`
      : "no smaller WebP variants were generated",
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
