import { load } from "js-yaml";
import siteYaml from "../content/site/data.yaml?raw";

import type { Locale } from "../i18n/common";

export interface SiteChannel {
  name: string;
  nameEn: string;
  description: { "zh-CN": string; en: string };
  icon: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  url: string;
  defaultLocale: Locale;
  locales: Locale[];
  github: string;
  email: string;
  logo: string;
  scenes: Record<"light" | "dark", {
    sky: string;
    foreground: string;
    layers: Record<"sky" | "distance" | "settlement" | "foreground", string>;
    alt: { "zh-CN": string; en: string };
  }>;
  channels: Record<"community" | "obtain" | "sponsor" | "legal", SiteChannel[]>;
  philosophy: Array<{ title: { "zh-CN": string; en: string }; description: { "zh-CN": string; en: string }; icon: string }>;
  members: Array<{ name: string; role: { "zh-CN": string; en: string }; description: { "zh-CN": string; en: string }; github: string }>;
}

interface RawSiteData {
  site: SiteConfig;
}

let cachedSite: SiteConfig | undefined;

export function loadSiteConfig(): SiteConfig {
  if (cachedSite) return cachedSite;
  const parsed = load(siteYaml) as RawSiteData;
  cachedSite = parsed.site;
  return cachedSite;
}

export function avifAssetPath(src: string): string {
  return src.replace(/\.(?:jpe?g|png|webp)$/i, ".avif");
}
