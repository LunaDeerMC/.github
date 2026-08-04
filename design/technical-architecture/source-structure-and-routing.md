# 源码目录与路由

> 返回[技术架构入口](./README.md)。

- 最后更新：2026-07-23
- 状态：已确认

## 分层结论

采用“部分分离”的源码结构：

- 首页、支持、关于、搜索和 404 等固定官网页面直接使用 Astro 文件路由。
- 作品介绍页源码和作品数据放在 `src/content/works/`，与 Astro 路由目录分离。
- 文档内容放在顶层 `docs/`，与 Astro 路由目录完全分离。
- `src/pages/works/` 和 `src/pages/docs/` 只放负责生成 URL 与静态页面的薄路由适配器。
- Content Collections 配置集中定义底层内容加载与单条数据 Schema。
- 内容聚合、跨内容校验和导航生成集中在 `src/lib/content/`，页面组件不直接扫描文件系统。
- `src/content/site/data.yaml` 作为单例配置直接加载，不注册为 Content Collection。

## 整体目录

```text
/
├── docs/                              # 文档内容源
│   ├── plugins/{documentSet}/
│   │   ├── zh-CN/
│   │   ├── en/
│   │   └── assets/
│   ├── cores/
│   ├── tools/
│   └── general/
│
├── src/
│   ├── content.config.ts             # Content Collections 与内容 Schema
│   ├── i18n/                         # 同一文件内保存页面的中英双语文案
│   │   ├── common.ts
│   │   ├── home.ts
│   │   ├── support.ts
│   │   ├── about.ts
│   │   ├── search.ts
│   │   └── errors.ts
│   │
│   ├── content/
│   │   ├── site/
│   │   │   └── data.yaml             # 全站与外部渠道配置
│   │   └── works/                    # 作品内容源
│   │       └── {work}/
│   │           ├── data.yaml
│   │           ├── index.mdx | index.astro
│   │           ├── copy.ts            # 自定义 Astro 页按需使用
│   │           ├── components/
│   │           ├── styles/
│   │           └── assets/
│   │
│   ├── pages/                         # Astro 路由
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── support.astro
│   │   ├── search.astro
│   │   ├── 404.astro
│   │   ├── works/
│   │   │   ├── index.astro
│   │   │   └── [work]/index.astro
│   │   └── docs/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   │
│   ├── components/
│   │   ├── shared/
│   │   ├── site/
│   │   ├── works/
│   │   └── docs/
│   │
│   ├── layouts/
│   │   ├── SiteLayout.astro
│   │   ├── DefaultWorkLayout.astro
│   │   └── DocsLayout.astro
│   │
│   ├── lib/
│   │   └── content/
│   │       ├── site/
│   │       ├── works/
│   │       ├── docs/
│   │       ├── routing/
│   │       ├── search/
│   │       └── validation/
│   │
│   ├── icons/
│   │   ├── brand/
│   │   ├── works/
│   │   └── docs/
│   │
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       └── markdown.css
│
├── public/
├── tests/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

目录中展示的作品 `copy.ts`、`components/`、`styles/` 和 `assets/` 都是可选目录，不要求每件作品创建空目录。

## Content Collections 划分

首期按内容职责划分为三个集合：

- `docs`：加载顶层 `docs/` 中的 Markdown 与 MDX 文档页面。
- `workData`：加载 `src/content/works/{work}/data.yaml` 作品基础数据。
- `workPages`：加载 `src/content/works/{work}/index.mdx` 默认作品介绍页。

`src/content/works/{work}/index.astro` 不属于 Content Collection，通过 `import.meta.glob()` 加载，再由内容领域层与 `workData` 聚合。`src/content/site/data.yaml` 由 `loadSiteConfig()` 单独处理，不属于以上任何集合。

## 固定官网页面

固定官网页面的 URL 与源码一一对应，不经过内容清单生成。它们通过 `loadSiteConfig()` 获取由 `src/content/site/data.yaml` 校验生成的 `SiteConfig`，并读取标准化作品数据，但不承担内容扫描逻辑。

中文与英文的固定页面都在构建时生成。中文保持既有无前缀 URL，英文输出到对应 `/en` 路径；页面源码采用共享布局，每个页面的中英文文案共同放在 `src/i18n/{page}.ts` 中，不能依赖客户端运行时替换整页语言。

## 作品介绍页路由

`src/pages/works/[work]/index.astro` 根据构建时作品清单生成所有 `/works/{work}` 静态页面：

- `src/content/works/{work}/index.mdx` 使用 `DefaultWorkLayout.astro` 渲染。
- `src/content/works/{work}/index.astro` 作为该作品的原生自定义主页渲染。
- 自定义主页需要高级交互、动画或 WebGL 时，由 `index.astro` 按需导入同目录或共享目录中的 React `.tsx` Island；入口文件本身仍为 Astro。
- 两种入口都读取同目录的 `data.yaml`。
- 同时存在两种入口、缺少入口或缺少 `data.yaml` 时构建失败。

`data.yaml` 和 `index.mdx` 优先通过 Content Collections 加载。自定义 `index.astro` 通过 `import.meta.glob()` 导入，在文件职责上是可导入的页面实现，最终 URL 仍由薄路由适配器建立。内容领域层负责将两类入口包装成统一作品记录。

双语构建后，同一作品从同一个 `index.mdx` 或 `index.astro` 产生中文 `/works/{work}` 与英文 `/en/works/{work}` 页面，不增加两个语言入口目录。MDX 使用构建期语言标签区分正文；自定义 Astro 页面从同目录 `copy.ts` 读取双语文案。两种输出共享稳定作品标识与 `routeId`。

## 文档路由

`src/pages/docs/[...slug].astro` 根据构建时文档清单生成文档静态页面：

- 顶层 `docs/{category}/{documentSet}/` 的物理目录决定文档集边界，内部 `zh-CN/` 与 `en/` 分别决定当前语言的侧边栏结构。
- Frontmatter `link` 决定页面最终 URL；未配置时从文件路径推导。
- Frontmatter `link` 和正文站内链接都使用不含 `/en` 的语言无关路径；英文渲染由路由解析器自动增加 `/en`。
- 路由适配器接收已经计算好的页面、侧边栏、本页目录和上一篇/下一篇数据，不在渲染时扫描目录。
- `/docs` 文档首页使用固定的 `src/pages/docs/index.astro`。

文档 Markdown/MDX 由 Content Collections 加载并执行单条 Frontmatter Schema 校验；文档集识别、永久链接唯一性、侧边栏、上一篇/下一篇和内部链接等跨条目关系由内容领域层生成和校验。

英文文档输出到 `/en/docs/{...path}`，中文文档继续使用 `/docs/{...path}`。侧边栏、上一篇/下一篇、搜索范围和文档集边界都在当前 locale 内计算，不把另一语言页面混入同一棵导航。文档允许只有一种语言；缺少对应翻译时不生成目标语言页面，直接访问该路径进入目标语言 404。完整规则以[国际化与双语路由](./internationalization.md)为准。

文档翻译通过去掉 locale 目录后的物理相对路径配对；两种语言可以使用各自的无前缀 `link` 生成不同公开 slug。主动站内链接必须在当前语言解析为真实页面，否则构建失败。

## Markdown、MDX 与 Astro 的使用边界

- 普通文档默认使用 `.md`，保持内容简单、易于编辑和迁移。
- 只有需要嵌入提示组件、标签页、配置演示或其他扩展组件时，文档才使用 `.mdx`。
- 默认作品介绍页固定使用 `index.mdx`，该文件名同时作为启用统一作品介绍页骨架的明确标志。
- 完全定制的作品主页固定使用 `index.astro`，不套用默认骨架。
- React 是唯一客户端 UI 框架。`.tsx` 只作为 Astro 页面和组件按需导入的交互或视觉 Island，不成为作品或文档的内容入口格式。
- 文档 `.md` 与 `.mdx` 使用相同的 Frontmatter Schema、路由、文档集识别和侧边栏规则；文件扩展名不进入最终 URL，也不改变导航语义。
- MDX 是 Markdown 的按需增强方式，不是普通文档的默认格式。MDX 文档只使用项目提供的共享文档组件和当前文档集的局部组件，不通过任意页面布局代码破坏统一文档阅读层。
- 默认作品页 `index.mdx` 的正文只作为“介绍”标签页内容；页面头部、标签页、右侧信息栏和获取方式由统一布局及 Frontmatter 生成。
- 默认作品页在同一 `index.mdx` 中使用一个 `locale="zh-CN"` 和一个 `locale="en"` 的顶层 `<Localized>` 块；构建时只渲染当前语言，不把两种正文同时输出到 HTML。
- `index.mdx` 执行完整 Frontmatter、正文和 `data.yaml` 跨文件一致性校验；`index.astro` 不需要导出或重复声明 `acquisition`、`gallery`、`github` 等默认模板字段。
- 自定义 `index.astro` 只执行作品共有校验、Astro 编译、路由输出、本地资源、站内链接和最终 HTML 基础输出检查，不从源码推断获取方式或页面内容结构。

## 选择部分分离的原因

- 固定官网页面没有内容路由需求，直接使用 Astro 文件路由最清楚。
- 作品具有双入口、共置数据和统一校验需求，使用内容清单生成路由更稳定。
- 文档永久链接可能与物理文件路径不同，必须将内容层级和 URL 解耦。
- 作品专属组件放在内容源目录中不会被 Astro 意外识别为公开路由。
- 路由适配器保持轻量后，内容层可以独立进行单元测试和构建校验。
