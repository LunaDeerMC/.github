import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

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

function innerHtmlBetween(html, startMarker, endTag) {
  const start = html.indexOf(startMarker);
  if (start < 0) return null;
  const contentStart = html.indexOf(">", start) + 1;
  if (contentStart <= 0) return null;
  const end = html.indexOf(endTag, contentStart);
  if (end < 0) return null;
  return html.slice(contentStart, end);
}

function titleFrom(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
}

function descriptionFrom(html) {
  return html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
}

function chunkPathForHtmlFile(file) {
  const rel = relative(dist, file).split(sep).join("/");
  if (!rel.endsWith("/index.html")) return null;
  const route = rel.slice(0, -"/index.html".length);
  return join(dist, "_docs-chunks", `${route}.json`);
}

async function buildDocsChunks() {
  const htmlFiles = [
    ...(await walk(join(dist, "docs"))),
    ...(await walk(join(dist, "en/docs"))),
  ].filter((file) => file.endsWith(".html"));

  let written = 0;
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    if (!html.includes('data-pagefind-body')) continue;

    const chunkPath = chunkPathForHtmlFile(file);
    if (!chunkPath) continue;

    const articleHtml = innerHtmlBetween(html, '<article class="docs-article', "</article>");
    const tocHtml = innerHtmlBetween(html, '<aside class="docs-toc" data-docs-toc>', "</aside>");
    if (articleHtml === null || tocHtml === null) {
      throw new Error(`Could not extract docs chunks from ${relative(dist, file)}`);
    }

    const chunk = {
      title: titleFrom(html),
      description: descriptionFrom(html),
      articleHtml,
      tocHtml,
    };

    await mkdir(dirname(chunkPath), { recursive: true });
    await writeFile(chunkPath, JSON.stringify(chunk), "utf8");
    written += 1;
  }

  console.log(`[docs-chunks] generated ${written} content chunk(s) in dist/_docs-chunks`);
}

await buildDocsChunks();
