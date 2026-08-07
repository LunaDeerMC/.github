import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";

import { optimizeImages } from "../../scripts/optimize-images.mjs";

const temporaryDirectories: string[] = [];

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function createImage(path: string, color: string): Promise<void> {
  await sharp({ create: { width: 24, height: 24, channels: 3, background: color } })
    .png()
    .toFile(path);
}

async function makeFixture() {
  const directory = await mkdtemp(join(tmpdir(), "lunadeermc-images-"));
  temporaryDirectories.push(directory);

  const assets = join(directory, "assets");
  await mkdir(join(assets, "works", "demo"), { recursive: true });
  await mkdir(join(assets, "scenes"), { recursive: true });

  await createImage(join(assets, "lunadeermc-brand-logo.png"), "#7744aa");
  await createImage(join(assets, "works", "demo", "cover.png"), "#336699");
  await createImage(join(assets, "works", "demo", "unused.png"), "#cc6633");
  await sharp({ create: { width: 24, height: 24, channels: 3, background: "#228833" } })
    .webp()
    .toFile(join(assets, "scenes", "sky.webp"));

  await writeFile(
    join(directory, "index.html"),
    `<!doctype html>
<html lang="zh-CN">
<head>
  <title>fixture</title>
</head>
<body>
  <img src="/assets/lunadeermc-brand-logo.png" alt="logo">
  <img src="/assets/works/demo/cover.png" alt="cover">
  <picture>
    <source srcset="/assets/works/demo/cover.avif" type="image/avif">
    <img src="/assets/works/demo/cover.png" alt="cover">
  </picture>
  <picture>
    <source srcset="/assets/scenes/sky.avif" type="image/avif">
    <img src="/assets/scenes/sky.webp" alt="sky">
  </picture>
</body>
</html>`,
  );
  await writeFile(join(directory, "app.js"), 'const image = "/assets/works/demo/unused.png";\n');

  return directory;
}

describe("image optimization", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("rewrites references, keeps only referenced AVIF variants and injects lazy attributes", async () => {
    const directory = await makeFixture();
    const messages: string[] = [];

    await optimizeImages(directory, { info: (message: string) => messages.push(message) });

    const assets = join(directory, "assets");
    expect(await exists(join(assets, "works", "demo", "cover.webp"))).toBe(true);
    expect(await exists(join(assets, "works", "demo", "cover.avif"))).toBe(true);
    expect(await exists(join(assets, "scenes", "sky.avif"))).toBe(true);
    expect(await exists(join(assets, "works", "demo", "unused.webp"))).toBe(true);
    expect(await exists(join(assets, "works", "demo", "unused.avif"))).toBe(false);
    expect(await exists(join(assets, "lunadeermc-brand-logo.webp"))).toBe(false);
    expect(await exists(join(assets, "lunadeermc-brand-logo.avif"))).toBe(false);

    const html = await readFile(join(directory, "index.html"), "utf8");
    expect(html).toContain("/assets/works/demo/cover.webp");
    expect(html).toContain("/assets/scenes/sky.avif");
    expect(html).not.toContain("/assets/works/demo/cover.png");
    expect(html.match(/<img\b[^>]*>/g)?.every((tag) => /\bloading="lazy"/.test(tag) && /\bdecoding="async"/.test(tag))).toBe(true);

    const script = await readFile(join(directory, "app.js"), "utf8");
    expect(script).toContain("/assets/works/demo/unused.webp");
    expect(script).not.toContain("/assets/works/demo/unused.png");

    expect(messages.join("\n")).toContain("AVIF variants");
  });
});
