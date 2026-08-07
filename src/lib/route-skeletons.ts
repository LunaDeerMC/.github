export type SkeletonType =
  | "home"
  | "works"
  | "work-detail"
  | "docs-index"
  | "docs-article"
  | "about"
  | "support"
  | "search"
  | "content";

export function resolveSkeletonType(pathname: string): SkeletonType {
  const path = pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";

  if (path === "/") return "home";
  if (path === "/works") return "works";
  if (path.startsWith("/works/")) return "work-detail";
  if (path === "/docs") return "docs-index";
  if (/^\/docs\/(plugins|cores|tools|general)$/.test(path)) return "docs-index";
  if (path.startsWith("/docs/")) return "docs-article";
  if (path === "/about") return "about";
  if (path === "/support") return "support";
  if (path === "/search") return "search";
  return "content";
}
