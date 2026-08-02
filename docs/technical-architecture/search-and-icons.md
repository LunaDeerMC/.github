# 搜索与图标

> 返回[技术架构入口](../technical-architecture.md)。

- 最后更新：2026-07-24
- 状态：已确认

## 静态全文搜索

使用 **Pagefind** 对 Astro 构建后的静态 HTML 生成全文搜索索引；使用 Pagefind JavaScript Search API 自研搜索弹窗与完整搜索结果页，不采用 Pagefind 成品界面，也不在内容领域层中重新实现全文搜索引擎。

```text
内容源与页面源码
        ↓
Astro 静态构建
        ↓
dist/**/*.html
        ↓
Pagefind 构建后索引
        ↓
dist/pagefind/*
```

搜索实现规则：

- 索引最终 HTML，因此统一覆盖固定官网页面、默认作品介绍页、自定义 Astro 作品主页和文档页面。
- 页面布局使用 `data-pagefind-body` 标记需要索引的主要内容，导航、页脚、文档侧边栏和其他重复界面不进入正文索引。
- 为搜索结果提供 `type`、`category`、`documentSet` 和 `status` 等元数据，使同一份索引支持全站、文档和当前文档集等不同搜索范围。
- 搜索结果显示页面类型、标题、摘要和必要归属信息；文档标题生成的子结果可以直接链接到具体章节锚点。
- 中文页面使用 `lang="zh-CN"`，英文页面使用 `lang="en"`，并使用包含中文专用分词支持的 Pagefind extended 版本。
- Pagefind 只在完整 Astro 产物上运行一次，并根据最终 HTML 的 `lang` 自动生成和加载各语言索引；不手工维护中文、英文两套索引目录。
- 中文页面只搜索中文索引，英文页面只搜索英文索引；不合并两种语言，也不在同一结果列表中提供跨语言搜索。
- 缺少目标语言翻译的文档不会出现在该语言索引中；搜索结果、范围过滤和完整结果页都只处理当前 locale 的公开页面。
- Minecraft 技术内容常见的配置文件名、权限节点和命名空间需要保留必要标点；首期从 `._:-` 开始配置，并通过真实语料测试调整。
- 顶部搜索弹窗只展示少量最佳结果，`/search` 提供完整结果；两者共用同一 Pagefind 索引和自研搜索组件。
- Pagefind 必须在 Astro 生成 HTML 后运行。普通 `astro dev` 不保证存在最新搜索索引，真实搜索使用完整构建预览流程测试。

构建命令职责：

```text
dev       → Astro 开发服务器，不依赖最新搜索索引
build     → Astro build → Pagefind index
preview   → 完整构建并预览包含搜索索引的站点
```

多语言搜索构建还需要验证：

- 所有可索引 HTML 都具有正确且受支持的 `lang`。
- 中文查询不会返回 `/en/**`，英文查询不会返回无前缀中文页面。
- 当前文档集、文档分类、全部文档和全站范围过滤不会跨 locale。
- 中文与英文的搜索界面文案由 LunaDeerMC 自研界面提供，不依赖 Pagefind 成品 UI 的默认翻译。
- 语言切换通过进入另一静态页面完成，Pagefind 在新页面自然加载对应索引，不在同一页面动态合并或热切换搜索语言。

## 图标集与本地 SVG

使用 **Lucide** 作为唯一默认界面与文档语义图标集，使用本地 SVG 注册表保存作品、品牌和少量定制图标。所有图标通过统一的 `LunaIcon` 组件解析和渲染；底层优先采用 `astro-icon` 与 `@iconify-json/lucide`，但业务内容和业务组件不直接依赖底层图标库。

界面功能图标不得自行绘制，品牌 Logo、图标视觉尺度和作品图标的设计边界以[品牌 Logo 与图标系统](../design/iconography-and-brand-assets.md)为准。

Frontmatter 和结构化数据只使用两种图标引用：

```yaml
icon: lucide:settings
icon: local:works/dominion
```

```ts
type IconReference =
  | `lucide:${string}`
  | `local:${string}`;
```

本地图标注册表：

```text
src/icons/
├── brand/
├── works/
└── docs/
```

图标系统规则：

- 不允许在 Frontmatter 中直接填写原始 `<svg>`、远程 SVG URL 或未列入白名单的 Iconify 图标集。
- 不安装包含全部图标集的 `@iconify/json`，只安装实际允许使用的单独图标集包。
- 不使用 Iconify 公共 API 或其他运行时图标服务；图标在构建期从本地依赖和本地 SVG 解析。
- `LunaIcon` 负责名称解析、尺寸、样式与可访问性属性，使底层图标实现可以替换而不影响内容格式。
- 内容领域层在构建时检查引用前缀、Lucide 图标名称、本地 SVG 路径及大小写；无效引用导致构建失败。
- 本地 SVG 不得包含脚本、外部资源或事件处理属性，并在构建期执行必要清理和优化。
- 文档 Frontmatter 的同一个 `icon` 同时用于侧边栏页面标题左侧和正文标题左侧。
- 文本旁用于辅助识别的图标默认设为装饰性；仅含图标的操作控件必须由控件提供可访问名称。
- `src/icons/` 只保存会被全站多个位置按名称引用的身份或语义图标；作品介绍页的功能配图和装饰素材仍与作品页面源码共置。
