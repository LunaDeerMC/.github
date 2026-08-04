import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, "") ?? "https://mc.lunadeer.cn";
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap-index.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
