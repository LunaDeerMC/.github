import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dist = join(root, "dist");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function routeFile(route) {
  const normalized = route.replace(/^\//, "").replace(/\/$/, "");
  if (!normalized) return join(dist, "index.html");
  if (normalized === "404") return join(dist, "404.html");
  return join(dist, normalized, "index.html");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(existsSync(dist), "dist/ does not exist; run the production build first");

const requiredFiles = [
  "robots.txt",
  "sitemap-index.xml",
  "manifest.webmanifest",
  "pagefind/pagefind-entry.json",
];
for (const file of requiredFiles) assert(existsSync(join(dist, file)), `Missing production file: ${file}`);

for (const theme of ["light", "dark"]) {
  for (const layer of ["sky", "distance", "settlement", "foreground"]) {
    const asset = `assets/scenes/${theme}/${layer}.webp`;
    assert(existsSync(join(dist, asset)), `Missing Hero scene layer: ${asset}`);
  }
}

const routes = new Set([
  "/",
  "/en/",
  "/works",
  "/en/works",
  "/docs",
  "/en/docs",
  "/support",
  "/en/support",
  "/about",
  "/en/about",
  "/search",
  "/en/search",
  "/404",
  "/en/404",
]);

const workDirectories = readdirSync(join(root, "src/content/works"), { withFileTypes: true }).filter((entry) => entry.isDirectory());
for (const directory of workDirectories) {
  routes.add(`/works/${directory.name}`);
  routes.add(`/en/works/${directory.name}`);
}

for (const file of walk(join(root, "docs")).filter((path) => path.endsWith(".mdx"))) {
  const parts = relative(join(root, "docs"), file).split(/[\\/]/);
  const localeIndex = parts.findIndex((part) => part.toLowerCase() === "zh-cn" || part === "en");
  if (localeIndex < 2) continue;
  const locale = parts[localeIndex].toLowerCase() === "en" ? "en/" : "";
  const remainder = parts.slice(localeIndex + 1).join("/").replace(/^index\.mdx$/, "").replace(/\/index\.mdx$/, "").replace(/\.mdx$/, "");
  routes.add(`/${locale}docs/${parts[0]}/${parts[1]}${remainder ? `/${remainder}` : ""}`);
}

for (const route of routes) {
  const file = routeFile(route);
  assert(existsSync(file), `Missing generated route ${route} (${relative(dist, file)})`);
  const html = readFileSync(file, "utf8");
  assert(/<title>[^<]+<\/title>/.test(html), `Missing title in ${route}`);
  assert(/<main\b/.test(html), `Missing main content in ${route}`);
  const expectedLanguage = route.startsWith("/en") ? 'lang="en"' : 'lang="zh-CN"';
  assert(html.includes(expectedLanguage), `Wrong language metadata in ${route}`);
  if (/^\/(?:en\/)?docs\//.test(route)) assert(html.includes("data-pagefind-body"), `Document route is not searchable: ${route}`);
}

for (const file of walk(dist).filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  assert(!html.includes("undefined"), `Unexpected undefined value in ${relative(dist, file)}`);
  assert(!html.includes("[object Object]"), `Unexpected object URL in ${relative(dist, file)}`);
  for (const match of html.matchAll(/(?:src|href)=["'](\/(?:assets|_astro|pagefind)\/[^"'#?]+)["']/g)) {
    const asset = match[1];
    assert(existsSync(join(dist, asset.slice(1))), `Missing local asset ${asset} referenced by ${relative(dist, file)}`);
  }
}

const sitemap = readFileSync(join(dist, "sitemap-index.xml"), "utf8");
assert(sitemap.includes("sitemap-0.xml"), "Sitemap index does not reference its sitemap");
const pagefindEntry = readFileSync(join(dist, "pagefind/pagefind-entry.json"), "utf8");
assert(pagefindEntry.trim().length > 20, "Pagefind entry is empty");
console.log(`Production build validated: ${routes.size} routes, ${statSync(dist).isDirectory() ? "dist/" : ""} ready`);
