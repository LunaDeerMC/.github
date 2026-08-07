import { resolveSkeletonType, type SkeletonType } from "../lib/route-skeletons";

type RouteLoadingWindow = Window & {
  __lunadeerRouteLoadingController?: AbortController;
};

export function initRouteLoading(): void {
  const overlay = document.querySelector<HTMLElement>("[data-route-loading]");
  const stage = document.querySelector<HTMLElement>("[data-route-loading-stage]");
  const live = document.querySelector<HTMLElement>("[data-route-live]");
  const templates = new Map<string, HTMLTemplateElement>();

  document.querySelectorAll<HTMLTemplateElement>("[data-skeleton-template]").forEach((template) => {
    const name = template.dataset.skeletonTemplate;
    if (name) templates.set(name, template);
  });

  const routeWindow = window as RouteLoadingWindow;
  routeWindow.__lunadeerRouteLoadingController?.abort();
  const controller = new AbortController();
  routeWindow.__lunadeerRouteLoadingController = controller;

  const locale = document.documentElement.dataset.locale === "en" ? "en" : "zh-CN";
  const loadingText = locale === "en" ? "Loading page…" : "正在加载页面……";
  let activeType: SkeletonType | null = null;

  function showSkeleton(type: SkeletonType): void {
    if (!overlay || !stage) return;
    if (!overlay.hidden && activeType === type) return;

    const template = templates.get(type) ?? templates.get("content");
    if (!template) return;

    activeType = type;
    stage.replaceChildren(template.content.cloneNode(true));
    overlay.hidden = false;
    document.body.setAttribute("aria-busy", "true");
    if (live) live.textContent = loadingText;
  }

  function isInternalLink(anchor: HTMLAnchorElement): URL | null {
    if (anchor.hasAttribute("download") || anchor.hasAttribute("target") || anchor.dataset.astroReload !== undefined) {
      return null;
    }

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return null;
    }

    if (url.origin !== window.location.origin) return null;
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return null;
    return url;
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

      const url = isInternalLink(target);
      if (url) showSkeleton(resolveSkeletonType(url.pathname));
    },
    { capture: true, signal: controller.signal },
  );

  document.addEventListener(
    "astro:before-preparation",
    (event) => {
      const to = (event as Event & { to?: URL }).to;
      const url = to ?? new URL(window.location.href);
      showSkeleton(resolveSkeletonType(url.pathname));
    },
    { signal: controller.signal },
  );

  document.addEventListener(
    "astro:after-swap",
    () => {
      activeType = null;
    },
    { signal: controller.signal },
  );
}
