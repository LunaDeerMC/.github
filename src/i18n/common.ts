export type Locale = "zh-CN" | "en";

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "中文",
  en: "English",
};

export const commonCopy = {
  "zh-CN": {
    nav: {
      support: "支持",
      about: "关于",
      works: "作品",
      docs: "文档",
      menu: "功能菜单",
      closeMenu: "关闭功能菜单",
      openMenu: "打开功能菜单",
      search: "搜索站内内容",
      language: "语言",
      theme: "主题模式",
      system: "跟随系统",
      light: "浅色",
      dark: "深色",
      organization: "组织",
      content: "内容",
      tools: "工具",
    },
    footer: {
      privacy: "隐私政策",
      terms: "使用条款",
      legal: "法律与政策",
      external: "外部链接",
    },
    actions: {
      learnMore: "了解更多",
      viewAll: "浏览全部作品",
      readDocs: "查看文档",
      viewDocs: "阅读文档",
      backHome: "返回首页",
      search: "搜索",
      clear: "清除筛选",
      open: "进入",
      external: "在新窗口打开",
      previous: "上一篇",
      next: "下一篇",
    },
    status: {
      active: "持续维护",
      earlyAccess: "早期体验",
      archived: "已归档",
      free: "免费",
      paid: "付费",
      freemium: "免费＋专业版",
    },
    types: {
      plugin: "插件",
      core: "服务端核心",
      tool: "开发工具",
      component: "工具与组件",
    },
  },
  en: {
    nav: {
      support: "Support",
      about: "About",
      works: "Works",
      docs: "Docs",
      menu: "Utilities",
      closeMenu: "Close utilities menu",
      openMenu: "Open utilities menu",
      search: "Search the site",
      language: "Language",
      theme: "Theme mode",
      system: "System",
      light: "Light",
      dark: "Dark",
      organization: "Organization",
      content: "Content",
      tools: "Tools",
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      legal: "Legal & policies",
      external: "External link",
    },
    actions: {
      learnMore: "Learn more",
      viewAll: "Browse all works",
      readDocs: "View docs",
      viewDocs: "Read docs",
      backHome: "Back home",
      search: "Search",
      clear: "Clear filters",
      open: "Open",
      external: "Open in a new window",
      previous: "Previous",
      next: "Next",
    },
    status: {
      active: "Maintained",
      earlyAccess: "Early access",
      archived: "Archived",
      free: "Free",
      paid: "Paid",
      freemium: "Free + Pro",
    },
    types: {
      plugin: "Plugin",
      core: "Server core",
      tool: "Developer tool",
      component: "Tool & component",
    },
  },
} as const;

export function localize(value: { "zh-CN"?: string; en?: string }, locale: Locale): string {
  const candidate = value[locale] ?? value.en ?? value["zh-CN"];
  return typeof candidate === "string" ? candidate : "";
}

export function withLocale(locale: Locale, path = "/") {
  if (locale === "zh-CN") return path || "/";
  if (path === "/") return "/en/";
  return `/en${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripLocale(pathname: string) {
  if (pathname === "/en" || pathname === "/en/") return "/";
  return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}

export function detectLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh-CN";
}
