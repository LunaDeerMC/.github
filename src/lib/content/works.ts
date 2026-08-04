import { getCollection } from "astro:content";

import type { Locale } from "../../i18n/common";
import { withLocale } from "../../i18n/common";
import { getWorkId } from "./ids";
import type { WorkPageRecord, WorkRecord } from "./types";

export async function getWorks(): Promise<WorkRecord[]> {
  const entries = await getCollection("workData");
  return entries
    .map((entry) => ({ id: getWorkId(entry.id), ...entry.data }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)) as WorkRecord[];
}

export async function getWork(id: string) {
  const works = await getWorks();
  return works.find((work) => work.id === id);
}

export async function getWorkPages() {
  const entries = await getCollection("workPages");
  return new Map(
    entries.map((entry) => {
      const id = entry.id.split("/")[0];
      const data = entry.data;
      const page: WorkPageRecord = {
        entry,
        github: data.github,
        license: data.license,
        links: data.links ?? [],
        gallery: data.gallery ?? [],
        acquisition: data.acquisition ?? [],
      };
      return [id, page] as const;
    }),
  );
}

export async function getWorkPage(id: string) {
  const pages = await getWorkPages();
  return pages.get(id);
}

export function workUrl(locale: Locale, id: string) {
  return withLocale(locale, `/works/${id}`);
}
