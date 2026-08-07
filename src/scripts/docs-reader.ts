import { resolveSkeletonType, type SkeletonType } from "../lib/route-skeletons";

interface DocChunk {
  title: string;
  description: string;
  articleHtml: string;
  tocHtml: string;
}

type DocsReaderWindow = Window & {
  __lunadeerDocsReaderController?: AbortController;
  __lunadeerRouteLoading?: {
    init: () => void;
    show: (type: SkeletonType) => void;
    hide: () => void;
  };
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

const chunkCache = new Map<string, Promise<DocChunk>>();
const readyPaths = new Set<string>();
let root: HTMLElement | null = null;
let currentSetPrefix = "";
let currentSetPaths = new Set<string>();
let lastAppliedPath = "";
let navigationToken = 0;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

function chunkUrlForPath(pathname: string): string {
  const path = normalizePath(pathname);
  return `/_docs-chunks${path}.json`;
}

function getChunk(pathname: string): Promise<DocChunk> {
  const path = normalizePath(pathname);
  const cached = chunkCache.get(path);
  if (cached) return cached;

  const promise = fetch(chunkUrlForPath(path), {
    headers: { Accept: "application/json" },
    cache: "default",
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Docs chunk request failed: ${response.status}`);
      return response.json() as Promise<DocChunk>;
    })
    .then((chunk) => {
      readyPaths.add(path);
      return chunk;
    })
    .catch((error) => {
      chunkCache.delete(path);
      throw error;
    });

  chunkCache.set(path, promise);
  return promise;
}

function prefetchChunk(pathname: string): void {
  void getChunk(pathname).catch(() => {});
}

function isInSetUrl(url: URL): boolean {
  if (!currentSetPrefix || url.origin !== window.location.origin) return false;
  return currentSetPaths.has(normalizePath(url.pathname));
}

export function isManagedUrl(url: URL): boolean {
  if (!isInSetUrl(url)) return false;
  return normalizePath(url.pathname) !== normalizePath(window.location.pathname);
}

export function isReady(url: URL): boolean {
  return readyPaths.has(normalizePath(url.pathname));
}

function showSkeletonForPath(pathname: string): void {
  const routeLoading = (window as DocsReaderWindow).__lunadeerRouteLoading;
  routeLoading?.show(resolveSkeletonType(pathname));
}

function hideSkeleton(): void {
  (window as DocsReaderWindow).__lunadeerRouteLoading?.hide();
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function applyChunk(chunk: DocChunk, pathname: string): boolean {
  if (!root) return false;
  const article = root.querySelector<HTMLElement>("article.docs-article");
  const toc = root.querySelector<HTMLElement>("[data-docs-toc]");
  if (!article) return false;

  article.innerHTML = chunk.articleHtml;
  if (toc) toc.innerHTML = chunk.tocHtml;

  const mobileTitle = root.querySelector<HTMLElement>(".docs-mobile-toolbar > strong");
  if (mobileTitle && chunk.title) mobileTitle.textContent = chunk.title;
  if (chunk.title) document.title = chunk.title;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description && chunk.description) description.setAttribute("content", chunk.description);

  const currentPath = normalizePath(pathname);
  root.querySelectorAll<HTMLAnchorElement>("[data-docs-sidebar] a").forEach((link) => {
    const href = normalizePath(new URL(link.getAttribute("href") || "", window.location.href).pathname);
    const active = href === currentPath;
    link.classList.toggle("is-current", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  root.classList.remove("is-sidebar-open", "is-toc-open");
  document.body.classList.remove("doc-drawer-open");
  window.scrollTo({ top: 0, behavior: "instant" });
  return true;
}

async function navigateTo(url: URL, options: { push?: boolean } = {}): Promise<void> {
  const path = normalizePath(url.pathname);
  if (path === lastAppliedPath && !url.hash) return;

  const token = ++navigationToken;
  if (!readyPaths.has(path)) showSkeletonForPath(path);

  try {
    const chunk = await getChunk(path);
    if (token !== navigationToken) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      root?.classList.add("is-docs-switching");
      await wait(140);
      if (token !== navigationToken) return;
    }

    if (options.push !== false) history.pushState({}, "", url.href);
    if (!applyChunk(chunk, path)) throw new Error("Docs reader shell is not available");
    lastAppliedPath = path;

    if (!reducedMotion) {
      const article = root?.querySelector<HTMLElement>("article.docs-article");
      article?.classList.add("docs-article--entering");
      root?.classList.remove("is-docs-switching");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => article?.classList.remove("docs-article--entering"));
      });
    }
    hideSkeleton();
  } catch {
    if (token !== navigationToken) return;
    hideSkeleton();
    root?.classList.remove("is-docs-switching");
    window.location.href = url.href;
  }
}

function startPrefetch(): void {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData || /2g/.test(connection?.effectiveType ?? "")) return;

  const run = () => {
    const currentPath = normalizePath(window.location.pathname);
    for (const path of currentSetPaths) {
      if (path !== currentPath) prefetchChunk(path);
    }
  };

  const docsWindow = window as DocsReaderWindow;
  if (docsWindow.requestIdleCallback) {
    docsWindow.requestIdleCallback(run, { timeout: 2000 });
  } else {
    window.setTimeout(run, 1000);
  }
}

export function initDocsReader(): void {
  root = document.querySelector<HTMLElement>("[data-docs-reader]");
  if (!root) return;

  const setId = root.getAttribute("data-doc-set-id");
  const rawLinks = root.getAttribute("data-doc-set-links");
  if (!setId || !rawLinks) return;

  const docsWindow = window as DocsReaderWindow;
  docsWindow.__lunadeerDocsReaderController?.abort();
  const controller = new AbortController();
  docsWindow.__lunadeerDocsReaderController = controller;

  const locale = document.documentElement.dataset.locale === "en" ? "en" : "zh-CN";
  currentSetPrefix = locale === "en" ? `/en/docs/${setId}` : `/docs/${setId}`;
  currentSetPaths = new Set(
    (JSON.parse(rawLinks) as string[]).map((link) => normalizePath(new URL(link, window.location.href).pathname)),
  );
  lastAppliedPath = normalizePath(window.location.pathname);

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (target.hasAttribute("download") || target.hasAttribute("target") || target.dataset.astroReload !== undefined) return;

      let url: URL;
      try {
        url = new URL(target.href, window.location.href);
      } catch {
        return;
      }
      if (!isManagedUrl(url)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

      event.preventDefault();
      event.stopPropagation();
      void navigateTo(url);
    },
    { capture: true, signal: controller.signal },
  );

  window.addEventListener(
    "popstate",
    () => {
      const url = new URL(window.location.href);
      if (isInSetUrl(url)) void navigateTo(url, { push: false });
    },
    { signal: controller.signal },
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-docs-toc] a") : null;
      if (target && root?.contains(target)) {
        root.classList.remove("is-toc-open");
        document.body.classList.remove("doc-drawer-open");
      }
    },
    { signal: controller.signal },
  );

  document.addEventListener(
    "astro:before-swap",
    () => {
      currentSetPrefix = "";
      currentSetPaths = new Set();
      controller.abort();
    },
    { once: true, signal: controller.signal },
  );

  let prefetchStarted = false;
  const startAfterLoad = () => {
    if (prefetchStarted) return;
    prefetchStarted = true;
    startPrefetch();
  };
  document.addEventListener("astro:page-load", startAfterLoad, { once: true, signal: controller.signal });
  window.addEventListener("load", startAfterLoad, { once: true, signal: controller.signal });
}
