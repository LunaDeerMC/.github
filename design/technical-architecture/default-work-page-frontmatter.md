# 默认作品页 Frontmatter

> 返回[内容模型索引](./content-models.md)。本文档是 `src/content/works/{work}/index.mdx` Frontmatter 的权威技术定义。

- 最后更新：2026-07-23
- 状态：已确认

## 页面职责

`index.mdx` 使用统一的 `DefaultWorkLayout.astro` 渲染成经过简化的资源介绍页。默认布局参考 Modrinth 项目页的信息组织方式，但降低信息密度，并增加 LunaDeerMC 自己的“获取方式”标签页。

```text
作品头部
图标｜名称｜一句简介｜状态与访问模式｜查看文档

介绍｜图库｜版本与更新｜获取方式
──────────────────────────
标签页主要内容           兼容性
                       相关链接
                       作品信息
```

数据来源：

- 作品名称、摘要、图标、生命周期、访问模式和兼容性来自同目录 `data.yaml`。
- 右上角“查看文档”读取 `data.yaml.docs.root`；未配置时不显示按钮。
- GitHub、授权、相关链接、图库和获取方式来自 `index.mdx` Frontmatter。
- MDX 正文只作为“介绍”标签页内容，不生成整个页面布局，也不重复编写作品一级标题。

标签页显示条件：

- “介绍”始终显示，内容为 MDX 正文。
- `gallery` 至少包含一张有效图片时显示“图库”。
- 配置 `github` 时，浏览器在页面加载后请求公开 GitHub Releases；获得至少一条可用 Release 时显示“版本与更新”。
- `acquisition` 至少包含一个有效档次时显示“获取方式”。
- `early-access` 和 `active` 作品必须配置非空 `acquisition`；`archived` 作品可以省略，省略后不显示“获取方式”。

## 最终 Schema

```ts
interface WorkPageFrontmatter {
  github?: string;
  license?: WorkLicense;
  links?: WorkLink[];
  gallery?: GalleryItem[];
  acquisition?: AcquisitionOption[];
}

interface LocalizedText {
  "zh-CN": string;
  en: string;
}

interface WorkLicense {
  name: string;
  url?: string;
}

type WorkLink =
  | {
      type: "source" | "issues" | "support" | "community";
      url: string;
      icon?: IconReference;
    }
  | {
      type: "other";
      label: LocalizedText;
      url: string;
      icon?: IconReference;
    };

interface GalleryItem {
  src: string;
  alt: LocalizedText;
  title?: LocalizedText;
  description?: LocalizedText;
}

interface AcquisitionOption {
  id: string;
  name: LocalizedText;
  access: "free" | "paid";
  description: LocalizedText;
  priceText?: LocalizedText;
  recommended?: boolean;
  benefits?: LocalizedText[];
  channels: AcquisitionChannel[];
}

interface AcquisitionChannel {
  name: string;
  url: string;
  actionLabel?: LocalizedText;
  note?: LocalizedText;
}
```

## 完整示例

```mdx
---
github: https://github.com/LunaDeerMC/example-work

license:
  name: GPL-3.0
  url: https://github.com/LunaDeerMC/example-work/blob/main/LICENSE

links:
  - type: source
    url: https://github.com/LunaDeerMC/example-work

  - type: issues
    url: https://github.com/LunaDeerMC/example-work/issues

  - type: support
    url: /support

  - type: other
    label:
      zh-CN: 使用统计
      en: Usage statistics
    icon: local:brand/bstats
    url: https://bstats.org/example

gallery:
  - src: ./assets/gallery/main.webp
    alt:
      zh-CN: Example Work 的主要功能界面
      en: Main interface of Example Work
    title:
      zh-CN: 主要功能
      en: Main features
    description:
      zh-CN: 在游戏内完成主要配置和管理操作。
      en: Complete essential configuration and management tasks in game.

  - src: ./assets/gallery/configuration.webp
    alt:
      zh-CN: Example Work 的配置界面
      en: Configuration interface of Example Work
    title:
      zh-CN: 配置管理
      en: Configuration

acquisition:
  - id: community
    name:
      zh-CN: 社区版
      en: Community
    access: free
    description:
      zh-CN: 包含基础功能，适合普通服务器使用。
      en: Includes essential features for regular servers.
    benefits:
      - zh-CN: 免费使用
        en: Free to use
      - zh-CN: 持续更新
        en: Continuous updates
      - zh-CN: 社区支持
        en: Community support
    channels:
      - name: GitHub
        url: https://github.com/LunaDeerMC/example-work/releases
        actionLabel:
          zh-CN: 前往下载
          en: Download

      - name: Modrinth
        url: https://modrinth.com/plugin/example-work
        actionLabel:
          zh-CN: 在 Modrinth 获取
          en: Get it on Modrinth

  - id: premium
    name:
      zh-CN: 专业版
      en: Professional
    access: paid
    description:
      zh-CN: 提供完整功能和商业作品支持。
      en: Includes the complete feature set and commercial support.
    priceText:
      zh-CN: ¥49 起
      en: From ¥49
    recommended: true
    benefits:
      - zh-CN: 完整功能
        en: Complete feature set
      - zh-CN: 优先技术支持
        en: Priority technical support
      - zh-CN: 优先参与测试
        en: Priority testing access
    channels:
      - name: Example Marketplace
        url: https://example.com/example-work
        actionLabel:
          zh-CN: 前往购买
          en: Purchase
        note:
          zh-CN: 购买和授权由第三方平台完成
          en: Purchase and licensing are handled by the third-party platform
---

<Localized locale="zh-CN">

## 作品介绍

这里开始的内容作为中文版“介绍”标签页正文。

</Localized>

<Localized locale="en">

## Introduction

This content is rendered in the English Introduction tab.

</Localized>
```

## 字段规则

所有用于结构化展示的文本字段都会在标准化记录中去除首尾空白，但不会改写源文件：

- `license.name` 与渠道 `name` 是语言无关的正式名称，必须是非空单行纯文本。
- 链接 `label`、图库 `alt` 与 `title`、获取档次 `name` 与 `priceText`、渠道 `actionLabel` 是 `LocalizedText`，两种语言分别必须是非空单行纯文本。
- 获取档次 `description`、`benefits`、渠道 `note` 和图库 `description` 也是 `LocalizedText`，两种语言均使用纯文本，不解析 Markdown 或 HTML。
- 必填文本规范化后为空时构建失败。
- 必填 `LocalizedText` 必须同时包含 `zh-CN` 与 `en`；可选本地化字段可以整体省略，一旦提供也必须包含两种语言。未知 locale 键产生 Warning 并被忽略。
- 不设置硬性字符数上限；富文本内容应放入 MDX 正文或对应通用文档。

### `github`

`github` 填写完整 GitHub 仓库地址，用于在浏览器加载页面后获取公开 GitHub Releases，并生成“版本与更新”标签页：

- 地址必须使用 HTTPS，并且只能指向 `https://github.com/{owner}/{repository}` 仓库根路径；Issues、Releases、分支、文件、查询参数和锚点地址无效。
- 标准化阶段可以安全移除仓库地址末尾的 `/` 或 `.git`，不改写源文件。
- 构建阶段只校验地址并提取仓库所有者与仓库名，不请求 GitHub，也不把 Release 数据写入静态 HTML。
- 页面加载后由客户端请求公开 Releases API；只支持无需身份验证即可读取的公开仓库，不在前端代码、静态资源或请求中放置 GitHub Token。
- GitHub REST API 支持浏览器跨域请求，但匿名请求按来源 IP 限制为每小时 60 次，因此同一仓库的数据应复用正在进行的请求并使用短期浏览器缓存，不能在每次切换标签页时重新请求。
- 忽略 Draft Release。
- Pre-release 显示为预发布版本。
- 展示版本名称、Tag、发布日期、更新说明和 Release Assets。
- 付费文件不得上传到公开 Release；付费版本可以只展示公开更新信息。
- 没有配置仓库或没有可用 Release 时隐藏整个标签页。
- 请求期间使用轻量加载状态；网络错误、API 限流或无权访问时在客户端降级，不影响页面其余内容，并保留前往仓库 Releases 页面的直接入口。
- 客户端获取的 Release 内容不进入 Pagefind、站点地图或构建产物中的 SEO 正文。
- `github` 不自动被当作开源地址展示；公开源码必须另外配置 `links.type: source`。

“版本与更新”同时回答“有哪些版本”和“更新了什么”。它不再拆成两个独立标签页。“获取方式”回答“从哪里获得、选择哪个档次以及是否需要付费”。

### `license`

- 整个字段可选，显示在右侧“作品信息”区域。
- `name` 必填。
- `url` 可选，可以是以 `/` 开头的有效站内路由，也可以是 HTTPS 外部地址。
- 授权信息不进入全站作品索引。

### `links`

标准类型为：

```text
source | issues | support | community | other
```

- 标准类型由页面自动生成名称和默认图标。
- `source`、`issues`、`support`、`community` 在同一作品中各最多出现一次，重复时构建失败；额外的同类入口使用 `type: other`。
- `other` 必须填写双语 `label`。
- `icon` 可选，使用统一的 `IconReference`。
- YAML 中的排列顺序就是页面显示顺序。
- 文档链接不放在这里，顶部“查看文档”按钮由 `data.yaml.docs.root` 负责。
- 获取或购买平台不放在这里，应属于相应获取档次的 `channels`。
- `url` 可以是以 `/` 开头的有效站内路由或 HTTPS 外部地址；不允许相对页面链接和其他协议。
- 两个 `other` 项的名称与 URL 都完全相同时产生 Warning，标准化记录只保留第一次出现的值。不同链接类型可以指向同一 URL。

### `gallery`

- `src` 和双语 `alt` 必填；双语 `title`、`description` 可选。
- `src` 可以是当前作品目录内的本地相对路径，也可以是 HTTPS 远程图片 URL。
- 本地路径不允许通过 `..` 越出作品目录，并且目标文件必须存在；远程图片只校验 URL 格式，不在构建时检查可访问性。
- 数组顺序就是图库顺序，第一张图片作为图库入口的首图。
- 不增加日期、分类、尺寸和布局方式等低价值配置。
- 作品核心功能配图既可以进入图库，也可以穿插在 MDX 正文中。图库负责集中浏览，正文图片负责配合具体说明。

### `acquisition`

`acquisition` 中的每一项表示一个作品版本或授权档次，而不是一个购买平台：

- `id` 必填，作为稳定标识和页面锚点；同一作品内必须唯一。
- 双语 `name` 必填，例如“社区版 / Community”或“专业版 / Professional”。
- `access` 必填，只允许 `free` 或 `paid`。
- 双语 `description` 必填，简要说明适用对象。
- 双语 `priceText` 为付费档次的可选展示文本，允许“¥49 起 / From ¥49”等表达。
- `recommended` 可选，一个作品最多只有一个推荐档次。
- `benefits` 可选，每一项都是中英文并排的 `LocalizedText`，列出该档次包含的优势。
- `channels` 必填且至少包含一个获取渠道。
- 渠道 `url` 可以是以 `/` 开头的有效站内路由或 HTTPS 外部地址。
- 同一档次中，渠道名称与 URL 都相同时构建失败；URL 相同但名称不同时产生 Warning，并在标准化记录中保留第一次出现的渠道。
- 双语 `actionLabel` 可选；省略后根据免费或付费状态从全站界面文案生成当前语言的默认操作名称。
- 双语 `note` 可选，用于说明第三方授权、账号要求或其他必要事项。

`data.yaml.accessModel` 与 `acquisition` 必须一致：

- `free`：所有获取档次都必须是 `free`。
- `paid`：所有获取档次都必须是 `paid`，不能混入免费档次。
- `freemium`：至少包含一个 `free` 档次和一个 `paid` 档次。

生命周期规则：

- `early-access` 和 `active` 作品必须包含至少一个有效获取档次。
- `archived` 作品可以省略整个 `acquisition` 字段。
- 归档作品保留 `acquisition` 时，仍然必须符合 `accessModel`，并且只保留仍然有效的获取渠道。
- 归档不会自动禁止下载；停止维护但仍可获取的作品可以继续显示“获取方式”。

退款政策、商业支持政策和第三方平台通用说明不在每件作品中重复维护，应链接到通用文档。

同一语言内完全相同的 `benefits` 文本产生 Warning，标准化记录只保留第一次出现的值。不同获取档次可以使用同一个第三方平台或相同渠道 URL。

### 允许跨内容重复

- `gallery.src` 可以重复，同一图片可以使用不同标题或说明再次出现。
- 不同作品可以使用相同名称、封面、GitHub 仓库或文档集；作品目录 ID 才是作品身份依据。

## 不使用的字段

`index.mdx` Frontmatter 首期不增加：

- `name`、`summary`、`type`、`lifecycle`、`accessModel`：已经属于 `data.yaml`。
- `compatibility`：需要参与全站筛选，继续属于 `data.yaml`。
- `docs`：继续由 `data.yaml.docs.root` 管理。
- `description`：MDX 正文本身就是“介绍”内容。
- `hero`、`features`：核心功能和配图由介绍正文自由组织，不建立第二套结构化正文模型。
- 自定义标签顺序、侧边栏布局、颜色和页面样式：统一模板不由内容文件控制。
- 退款、商业支持和第三方平台通用政策：统一由通用文档维护。

## 构建校验

- Frontmatter 只提取本页 Schema 定义的已知字段。未知的顶层或嵌套字段产生 Warning 并被标准化记录忽略，不导致构建失败，也不会从源文件中自动删除。
- 必填字段缺失、已知字段类型错误、枚举值无效或违反跨字段约束时构建失败。
- 本地化字段缺少 `zh-CN` 或 `en` 时构建失败；未知 locale 键只产生 Warning 并被忽略。
- 结构化文本包含 Markdown、HTML，或者要求单行的字段包含换行时构建失败。
- `acquisition.id` 在作品内唯一，`recommended` 最多一个，`channels` 不为空。
- 标准链接类型重复、`acquisition.id` 重复、多个推荐档次或完全相同的渠道重复时构建失败。
- 重复 benefits、重复 other 链接和同渠道 URL 的非确定性重复只产生 Warning，并在标准化记录中保留第一项。
- `early-access` 和 `active` 作品缺少有效 `acquisition` 时构建失败；`archived` 作品允许省略。
- `accessModel` 与所有获取档次的 `access` 一致；`paid` 不得包含免费档次。
- MDX 正文必须且只能包含一个中文和一个英文顶层 `<Localized>` 块；两个块都必须包含有效“介绍”内容。只有 Frontmatter、import/export 语句、注释、空白或空语言块时构建失败。
- 本地图片必须存在，远程图片必须使用合法 HTTPS URL；所有图库图片都必须具有有效 `alt`。
- `IconReference` 必须指向受支持的 Lucide 图标或本地 SVG。
- 站内链接必须以 `/` 开头并指向有效路由；外部链接必须使用 HTTPS。
- 普通生产构建不请求 GitHub Releases 或其他第三方地址；第三方链接或远程图片暂时不可访问不会导致构建失败。
- 构建期只校验 `github` 的 URL 结构。Release 的加载、空数据、限流和网络失败都属于浏览器运行时状态；本地必填字段、已知字段类型、资源或链接错误仍应阻止构建。
