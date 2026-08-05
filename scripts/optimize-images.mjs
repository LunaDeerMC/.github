import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const sourceImageExtensions = new Set([".jpeg", ".jpg", ".png", ".webp"]);
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

function addAsyncImageAttributes(source) {
  return source.replace(/<img\b([^>]*?)>/gi, (_match, rawAttributes) => {
    let attributes = rawAttributes.replace(/\s*\/\s*$/, "");
    if (!/\bloading\s*=/.test(attributes)) attributes += ' loading="lazy"';
    if (!/\bdecoding\s*=/.test(attributes)) attributes += ' decoding="async"';
    return `<img${attributes}>`;
  });
}

async function optimizeImages(outputDirectory, logger) {
  const assetsDirectory = join(outputDirectory, "assets");
  const allFiles = await walk(outputDirectory);
  const assetFiles = allFiles.filter((path) => path === assetsDirectory || path.startsWith(`${assetsDirectory}${sep}`));
  const imageFiles = assetFiles.filter((path) => sourceImageExtensions.has(extname(path).toLowerCase()));
  const replacements = new Map();
  let sourceBytes = 0;
  let optimizedBytes = 0;
  let convertedCount = 0;
  let avifCount = 0;

  for (const sourcePath of imageFiles) {
    const relativePath = toPosixPath(relative(outputDirectory, sourcePath));
    if (preservedFiles.has(relativePath)) continue;

    const sourceStats = await stat(sourcePath);
    const sourceExtension = extname(sourcePath);

    if (sourceExtension.toLowerCase() !== ".webp") {
      const webpPath = sourcePath.slice(0, -sourceExtension.length) + ".webp";
      const webpRelativePath = toPosixPath(relative(outputDirectory, webpPath));
      await sharp(sourcePath, { failOn: "none" })
        .webp({ quality: 82, effort: 5, smartSubsample: true })
        .toFile(webpPath);

      const webpStats = await stat(webpPath);
      if (webpStats.size < sourceStats.size) {
        sourceBytes += sourceStats.size;
        optimizedBytes += webpStats.size;
        convertedCount += 1;
        replacements.set(`/${relativePath}`, `/${webpRelativePath}`);
      } else {
        await unlink(webpPath);
      }
    }

    const avifPath = sourcePath.slice(0, -sourceExtension.length) + ".avif";
    await sharp(sourcePath, { failOn: "none" })
      .avif({ quality: 55, effort: 6 })
      .toFile(avifPath);
    avifCount += 1;

    // WebP 不划算（不小于原图）时，若 AVIF 更小则回退使用 AVIF 替换引用，
    // 保证构建产物中的图片只保留优化格式，避免未优化的栅格引用被校验拒绝。
    if (!replacements.has(`/${relativePath}`)) {
      const avifStats = await stat(avifPath);
      if (avifStats.size < sourceStats.size) {
        const avifRelativePath = toPosixPath(relative(outputDirectory, avifPath));
        sourceBytes += sourceStats.size;
        optimizedBytes += avifStats.size;
        convertedCount += 1;
        replacements.set(`/${relativePath}`, `/${avifRelativePath}`);
      }
    }
  }

  const textFiles = allFiles.filter((path) => textExtensions.has(extname(path).toLowerCase()));
  const orderedReplacements = [...replacements.entries()].sort(([a], [b]) => b.length - a.length);

  for (const textPath of textFiles) {
    const source = await readFile(textPath, "utf8");
    let rewritten = orderedReplacements.reduce(
      (content, [from, to]) => content.split(from).join(to),
      source,
    );
    if (extname(textPath).toLowerCase() === ".html") rewritten = addAsyncImageAttributes(rewritten);
    if (rewritten !== source) await writeFile(textPath, rewritten);
  }

  logBuildMessage(
    logger,
    `generated ${convertedCount} WebP and ${avifCount} AVIF variants; WebP references reduced by ${formatBytes(sourceBytes - optimizedBytes)}`,
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
