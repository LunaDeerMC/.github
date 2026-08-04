import type { Locale } from "../../i18n/common";
import { commonCopy, withLocale } from "../../i18n/common";
import { getDocumentPages } from "./documents";
import { getWorks } from "./works";
import type { SearchRecord } from "./types";

export async function getSearchIndex(locale: Locale): Promise<SearchRecord[]> {
  const [works, docs] = await Promise.all([getWorks(), getDocumentPages(locale)]);
  const copy = commonCopy[locale];
  const workRecords = works.map((work) => ({
    title: work.name,
    url: withLocale(locale, `/works/${work.id}`),
    type: copy.types[work.type],
    category: copy.types[work.type],
    summary: work.summary[locale],
    status: copy.status[work.lifecycle === "archived" ? "archived" : work.lifecycle === "early-access" ? "earlyAccess" : "active"],
  }));
  const docRecords = docs
    .filter((page) => !page.draft && !page.hidden)
    .map((page) => ({
      title: page.title,
      url: withLocale(locale, page.url),
      type: locale === "en" ? "Documentation" : "文档",
      category: page.category,
      documentSet: page.set,
      summary: page.description ?? "",
      status: page.documentSet?.status === "archived" ? (locale === "en" ? "Archived" : "已归档") : undefined,
    }));
  const fixed: SearchRecord[] = [
    {
      title: locale === "en" ? "Support" : "支持",
      url: withLocale(locale, "/support"),
      type: locale === "en" ? "Support" : "支持",
      summary: locale === "en" ? "Find the right community, acquisition, sponsorship, and policy channel." : "找到社区、获取、赞助与政策的正确入口。",
    },
    {
      title: locale === "en" ? "About LunaDeerMC" : "关于 LunaDeerMC",
      url: withLocale(locale, "/about"),
      type: locale === "en" ? "Organization" : "组织",
      summary: locale === "en" ? "Learn what LunaDeerMC builds and how the team works." : "了解 LunaDeerMC 正在做什么，以及团队如何协作。",
    },
  ];
  return [...workRecords, ...docRecords, ...fixed];
}
