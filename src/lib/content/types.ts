import type { CollectionEntry } from "astro:content";

export type WorkType = "plugin" | "core" | "tool" | "component";
export type AccessModel = "free" | "paid" | "freemium";
export type Lifecycle = "early-access" | "active" | "archived";

export interface LocalizedText {
  "zh-CN": string;
  en: string;
}

export interface WorkRecord {
  id: string;
  name: string;
  summary: LocalizedText;
  type: WorkType;
  accessModel: AccessModel;
  lifecycle: Lifecycle;
  featured: boolean;
  publishedAt: string;
  icon: string;
  iconSrc?: string;
  cover: { src: string; alt?: LocalizedText };
  compatibility?: { minecraft?: string[]; platforms?: string[] };
  docs?: { root: string };
  archive?: { archivedAt?: string | null; note?: LocalizedText | null; replacement?: string | null };
}

export interface WorkPageRecord {
  entry: CollectionEntry<"workPages">;
  github?: string;
  license?: { name: string; url?: string };
  links: Array<{
    text: LocalizedText;
    icon: string;
    url: string;
  }>;
  gallery: Array<{
    src: string;
    alt: LocalizedText;
    title?: LocalizedText;
    description?: LocalizedText;
  }>;
  acquisition: Array<{
    id: string;
    name: LocalizedText;
    access: "free" | "paid";
    description: LocalizedText;
    priceText?: LocalizedText;
    recommended?: boolean;
    benefits?: LocalizedText[];
    channels: Array<{
      name: string;
      url: string;
      actionLabel?: LocalizedText;
      note?: LocalizedText;
    }>;
  }>;
}

export interface DocumentPageRecord {
  entry: CollectionEntry<"docs">;
  id: string;
  category: string;
  set: string;
  locale: "zh-CN" | "en";
  path: string;
  url: string;
  isRoot: boolean;
  title: string;
  label?: string;
  description?: string;
  icon?: string;
  layout: "default" | "wide";
  draft: boolean;
  hidden: boolean;
  order?: number;
  documentSet?: { order: number; status: "active" | "archived" };
}

export interface DocumentTreeNode {
  path: string;
  label: string;
  page?: DocumentPageRecord;
  children: DocumentTreeNode[];
  order: number;
  containsCurrent: boolean;
}

export interface DocumentSetRecord {
  id: string;
  category: string;
  set: string;
  locale: "zh-CN" | "en";
  root: DocumentPageRecord;
  pages: DocumentPageRecord[];
  status: "active" | "archived";
}

export interface SearchRecord {
  title: string;
  url: string;
  type: string;
  category?: string;
  documentSet?: string;
  summary: string;
  status?: string;
}
