import { getCollection } from "astro:content";

import type { Locale } from "../../i18n/common";
import { withLocale } from "../../i18n/common";
import { parseDocumentId } from "./ids";
import type { DocumentPageRecord, DocumentSetRecord } from "./types";

function defaultUrl(category: string, set: string, path: string) {
  return `/docs/${category}/${set}${path ? `/${path}` : ""}`;
}

export async function getDocumentPages(locale?: Locale): Promise<DocumentPageRecord[]> {
  const entries = await getCollection("docs");
  return entries
    .map((entry) => {
      const parsed = parseDocumentId(entry.id);
      const data = entry.data;
      const isRoot = parsed.path === "";
      return {
        entry,
        id: entry.id,
        ...parsed,
        url: data.link ?? defaultUrl(parsed.category, parsed.set, parsed.path),
        isRoot,
        title: data.title,
        label: data.sidebar?.label,
        description: data.description,
        icon: data.icon ?? undefined,
        layout: data.layout ?? "default",
        draft: data.draft ?? false,
        hidden: data.sidebar?.hidden ?? false,
        order: data.sidebar?.order,
        documentSet: isRoot && data.documentSet ? data.documentSet : undefined,
      } satisfies DocumentPageRecord;
    })
    .filter((page) => (locale ? page.locale === locale : true));
}

export async function getDocumentPage(locale: Locale, path: string) {
  const normalized = path.replace(/\/$/, "") || "/";
  const pages = await getDocumentPages(locale);
  return pages.find((page) => page.url.replace(/\/$/, "") === normalized);
}

export async function getDocumentSets(locale: Locale, category?: string): Promise<DocumentSetRecord[]> {
  const pages = await getDocumentPages();
  const groups = new Map<string, DocumentPageRecord[]>();
  for (const page of pages) {
    if (page.draft) continue;
    if (category && page.category !== category) continue;
    const id = `${page.category}/${page.set}`;
    const current = groups.get(id) ?? [];
    current.push(page);
    groups.set(id, current);
  }

  return [...groups.entries()]
    .map(([id, setPages]) => {
      const root = setPages.find((page) => page.locale === locale && page.isRoot);
      if (!root) return undefined;
      return {
        id,
        category: root.category,
        set: root.set,
        locale,
        root,
        pages: setPages,
        status: root.documentSet?.status ?? "active",
      } satisfies DocumentSetRecord;
    })
    .filter((set): set is DocumentSetRecord => Boolean(set))
    .sort((a, b) => {
      const orderA = a.root.documentSet?.order ?? 0;
      const orderB = b.root.documentSet?.order ?? 0;
      return orderA - orderB || a.root.title.localeCompare(b.root.title, locale === "en" ? "en" : "zh-CN");
    });
}

export async function getDocumentSetPages(locale: Locale, category: string, set: string) {
  const pages = await getDocumentPages(locale);
  return pages
    .filter((page) => page.category === category && page.set === set && !page.draft && !page.hidden)
    .sort((a, b) => {
      const orderA = a.isRoot ? -1 : a.order ?? 1000;
      const orderB = b.isRoot ? -1 : b.order ?? 1000;
      return orderA - orderB || a.title.localeCompare(b.title, locale === "en" ? "en" : "zh-CN");
    });
}

export function documentUrl(locale: Locale, page: DocumentPageRecord) {
  return withLocale(locale, page.url);
}
