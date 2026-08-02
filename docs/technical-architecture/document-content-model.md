# 文档内容模型

> 返回[内容模型索引](./content-models.md)。

- 最后更新：2026-07-23
- 状态：已确认

## 文档集模型

不为文档集新增独立 `data.yaml` 或第四个 Content Collection。每个 `docs/{category}/{documentSet}/` 目录本身构成一个文档集，其内部按 locale 建立内容根目录；每个已发布语言目录必须包含 `index.md` 或 `index.mdx`，该根页面同时作为当前语言的文档集入口和身份数据来源。文档集至少需要存在一种语言。

```text
docs/plugins/dominion/
├── zh-CN/
│   ├── index.md
│   ├── installation.md
│   └── configuration/
│       └── index.md
├── en/
│   ├── index.md
│   └── installation.md
└── assets/
```

根页面通过普通页面字段提供文档集名称、说明和图标，并通过仅允许出现在文档集根页面上的 `documentSet` 字段提供文档集级配置：

```yaml
---
title: Dominion
description: Dominion 的安装、配置与使用文档。
icon: local:works/dominion
documentSet:
  order: 10
  status: active
---
```

文档集识别规则：

- `docs/{category}/{documentSet}/` 的物理路径确定文档分类和文档集 ID，locale 目录不进入 ID。
- `docs/{category}/{documentSet}/{locale}/` 确定当前语言的文档树和侧边栏边界。
- 已存在的语言根目录缺少入口、同时存在 `index.md` 与 `index.mdx`，或普通页面填写 `documentSet` 时构建失败。
- 当前语言根页面的 `title`、`description` 和 `icon` 用于该语言文档分类列表中的文档集条目。
- 作品 `data.yaml` 中的可选 `docs.root` 单向引用文档集；一件作品最多引用一个文档集。文档集不保存反向作品引用，也不要求必须被作品关联。
- 未被作品引用的 `plugins`、`cores`、`tools` 或 `general` 文档集都可以独立存在；多件作品也可以引用同一个文档集。
- 作品类型与文档分类严格对应：`plugin → plugins`、`core → cores`、`tool/component → tools`。`general` 文档集不得被任何作品通过 `docs.root` 关联。
- 页面级 Frontmatter、文件目录和文档集根元数据共同生成标准化 `DocumentSetRecord`，不重复维护手写侧边栏。

## 双语页面对应

- 文档文件本身只编写当前 locale 的内容；文档 Frontmatter 不使用 `LocalizedText`。
- 去掉 `zh-CN/` 或 `en/` 目录后的物理相对路径相同时，视为同一页面的两种翻译。
- 显式 `link` 只改变公开 URL，不改变源文件之间的翻译对应关系。
- 当前语言不存在对应文件时，不生成该语言页面；语言切换进入目标路径后由目标语言 404 处理。
- `title`、`description` 和 `sidebar.label` 分别使用当前文件语言。
- `draft`、`sidebar.order`、`sidebar.hidden` 和 `layout` 允许两种语言独立配置。
- 两个语言根页面同时存在时，`documentSet.order`、`documentSet.status` 和文档集根 `icon` 必须一致；不一致时构建失败。只有一种语言时不执行跨语言比较。

## 文档页面 Frontmatter

所有普通文档和文档集根页面共用一份克制的基础 Schema：

```ts
interface DocumentFrontmatter {
  title: string;
  description?: string;
  icon?: IconReference;
  link?: string;
  layout?: "default" | "wide";
  draft?: boolean;
  sidebar?: SidebarOptions;
  documentSet?: DocumentSetOptions;
}

interface SidebarOptions {
  label?: string;
  order?: number;
  hidden?: boolean;
}

interface DocumentSetOptions {
  order?: number;
  status?: "active" | "archived";
}
```

字段规则：

- `title` 是所有文档唯一必填的基础字段，由文档阅读布局生成页面唯一一级标题。正文从二级标题开始；正文出现一级标题时构建失败。
- `description` 在普通页面中可选，在文档集根页面中必填。
- `icon` 使用统一的 `IconReference`；同一个图标同时显示在侧边栏标题左侧和正文标题左侧。
- `link` 配置当前文档的语言无关永久链接；未配置时从 locale 目录下的文件路径推导。
- `layout` 默认为 `default`，特殊宽内容使用 `wide`。
- `draft` 默认为 `false`。草稿在开发环境中可访问，但生产环境不生成页面，也不进入导航、页面前后关系、搜索和站点地图。
- 公开页面链接到生产环境不存在的草稿页面时构建失败。文档集根页面为草稿时，整个文档集不进入生产构建。
- `sidebar.label` 只改变侧边栏文字，不改变正文标题、SEO 标题或 URL。
- `sidebar.order` 必须是整数。显式配置顺序的同级条目优先按数值排列，未配置的条目随后按标题自然排序。
- `sidebar.hidden` 默认为 `false`。隐藏页面仍生成并可通过直接链接访问，但不进入侧边栏、上一篇/下一篇、搜索索引和站点地图。
- 没有入口页的目录仍可成为不可点击的侧边栏分组，名称从目录名生成；需要自定义分组名称、图标或顺序时，为该目录增加 `index.md` 或 `index.mdx`。
- `documentSet` 只允许出现在文档集根页面，默认值为 `order: 0` 和 `status: active`。归档文档集仍然公开、可搜索和可阅读，但必须显示归档状态。
- 首期不增加 `keywords`、`author`、`updatedAt`、`toc`、`redirects`、`version` 或 `editUrl`。

### 永久链接与站内链接

- 内容源中的 `link` 必须以 `/` 开头，但禁止包含 `/en` 语言前缀。
- 中文页面直接使用标准化后的 `link`；英文页面由构建系统自动添加 `/en`。
- 两种翻译可以填写不同的无前缀 `link`，以便使用各自语言适合的 slug。
- 文档正文中的站内链接同样使用无语言前缀路径；构建英文页面时，路由解析器自动指向对应英文路径。
- 外部 HTTPS 链接、锚点和非本地化静态资源不添加 `/en`。
- 如果英文正文主动链接到不存在的英文文档，构建失败；只有语言切换允许进入缺失翻译后的 404。

## 构建校验

- 每个已存在的文档集语言根目录只能存在一种入口，并且普通页面不能配置 `documentSet`。
- 不对文档集执行“必须关联作品”或“只能被一件作品引用”的反向校验。
- 作品文档集的分类必须与关联作品类型一致；分类不匹配或作品关联 `general` 时构建失败。
- `link` 必须是合法的站内绝对路径且全站唯一。
- `link` 或正文站内链接在内容源中显式包含 `/en` 时构建失败。
- 构建完成后，最终中文与英文 pathname 必须分别保持全站唯一。
- 存在两种翻译时校验其物理相对路径对应关系，以及文档集共享字段一致性。
- `icon` 必须符合统一的 `IconReference`，并指向真实图标。
- 文档侧边栏、上一篇和下一篇只在当前文档集内计算。
- 内部链接、图片和标题锚点必须有效。
- 草稿与隐藏状态必须正确反映到导航、搜索、站点地图和生产构建中。
