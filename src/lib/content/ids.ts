import type { Locale } from "../../i18n/common";

const localeSegments = new Set(["zh-cn", "en"]);

export interface DocumentIdParts {
  category: string;
  set: string;
  locale: Locale;
  path: string;
}

/**
 * Convert a glob-loader document id into the public document coordinates.
 * Astro normalizes the zh-CN directory to zh-cn in collection ids.
 */
export function parseDocumentId(id: string): DocumentIdParts {
  const segments = id.replaceAll("\\", "/").split("/").filter(Boolean);
  const localeIndex = segments.findIndex((segment) => localeSegments.has(segment.toLowerCase()));
  if (localeIndex < 2) {
    throw new Error(`Document id must contain category, set, and locale: ${id}`);
  }

  const category = segments[0];
  const set = segments[1];
  const locale = (segments[localeIndex].toLowerCase() === "en" ? "en" : "zh-CN") as Locale;
  const sourcePath = segments.slice(localeIndex + 1).join("/");
  const path = sourcePath.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
  return { category, set, locale, path };
}

export function getWorkId(id: string) {
  return id.replace(/\/data$/, "").split("/")[0];
}
