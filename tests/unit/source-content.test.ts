import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const worksRoot = join(root, "src/content/works");
const docsRoot = join(root, "docs");

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function frontmatter(path: string) {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? load(match[1]) as Record<string, unknown> : {};
}

describe("source content coverage", () => {
  it("gives every work one data source and one page source", () => {
    const directories = readdirSync(worksRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    const ids = new Set<string>();

    for (const directory of directories) {
      const workRoot = join(worksRoot, directory.name);
      const dataPath = join(workRoot, "data.yaml");
      const pagePath = join(workRoot, "index.mdx");
      const customPagePath = join(workRoot, "index.astro");
      expect(existsSync(dataPath)).toBe(true);
      expect(existsSync(pagePath) || existsSync(customPagePath)).toBe(true);

      const data = load(readFileSync(dataPath, "utf8")) as Record<string, unknown>;
      expect(typeof data.name).toBe("string");
      expect(["plugin", "core", "tool", "component"]).toContain(data.type);
      expect(["free", "paid", "freemium"]).toContain(data.accessModel);
      expect(["early-access", "active", "archived"]).toContain(data.lifecycle);
      expect(ids.has(directory.name)).toBe(false);
      ids.add(directory.name);
    }

    expect(ids.size).toBeGreaterThanOrEqual(4);
  });

  it("keeps every published document root available in at least one language", () => {
    const roots = walk(docsRoot)
      .filter((path) => /[/\\](zh-CN|en)[/\\]index\.mdx$/.test(path))
      .map((path) => relative(docsRoot, path).replace(/[/\\](zh-CN|en)[/\\]index\.mdx$/, ""));
    const rootSet = new Set(roots);
    expect(rootSet.size).toBeGreaterThanOrEqual(5);

    for (const documentRoot of rootSet) {
      const zhIndex = existsSync(join(docsRoot, documentRoot, "zh-CN/index.mdx"));
      const enIndex = existsSync(join(docsRoot, documentRoot, "en/index.mdx"));
      expect(zhIndex || enIndex, documentRoot).toBe(true);
    }
  });

  it("gives every document file a title frontmatter field", () => {
    for (const path of walk(docsRoot).filter((item) => /\.(md|mdx)$/.test(item) && /[/\\](zh-CN|en)[/\\]/.test(item))) {
      const data = frontmatter(path);
      expect(typeof data.title, relative(docsRoot, path)).toBe("string");
      expect(String(data.title).trim().length).toBeGreaterThan(0);
    }
  });
});
