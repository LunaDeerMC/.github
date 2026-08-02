# LunaDeerMC 官网技术架构

> 本文档是 LunaDeerMC 官网技术架构文档的入口，只保留总体结论、专题索引和待讨论事项。具体规则按职责拆分到 `docs/technical-architecture/`。尚未达成一致的实现细节应标记为“待决定”，不应提前作为开发约束。

- 项目：LunaDeerMC 官方网站
- 文档类型：技术架构决策入口
- 创建日期：2026-07-19
- 最后更新：2026-08-02
- 当前状态：持续更新

## 总体结论

使用 **Astro** 作为静态网站框架，以 **Astro Content Collections** 作为底层内容基础设施，在其上自研 LunaDeerMC 专用的内容领域层和文档阅读层；不采用 Starlight，也不开发独立于 Astro 的通用内容系统或静态网站生成器。

源码采用“部分分离”结构：

- 首页、支持、关于、搜索和 404 等固定官网页面使用 Astro 文件路由。
- 作品内容放在 `src/content/works/`，文档内容放在顶层 `docs/`。
- `src/pages/works/` 与 `src/pages/docs/` 只负责 URL 和静态页面生成。
- Content Collections 负责内容加载、单条 Schema、类型和查询。
- LunaDeerMC 内容领域层负责作品聚合、文档集、路由、导航、搜索元数据和跨文件校验。
- 默认作品介绍页使用 `index.mdx` 和统一布局；特殊作品使用 `index.astro` 自定义主页。
- React 是项目唯一的客户端 UI 框架；Astro 继续负责页面、布局和静态内容，React 只通过按需 Hydration 的 Island 承担客户端交互与高级视觉体验。

```text
Astro
├── 通用静态网站能力
├── Astro Content Collections
├── LunaDeerMC 专用内容领域层
└── LunaDeerMC 官网与文档界面层
```

内容处理与界面渲染必须解耦。组件不直接扫描文件系统；内容源和 Astro 自定义主页先由内容领域层聚合、校验并转换成标准化记录，再交给页面和组件渲染。

## 专题文档

| 文档 | 内容 |
| --- | --- |
| [框架选择与架构边界](./technical-architecture/framework-and-boundaries.md) | Astro、Content Collections、自研领域层和文档阅读层的职责边界 |
| [源码目录与路由](./technical-architecture/source-structure-and-routing.md) | 实际源码目录、内容集合、薄路由以及 Markdown、MDX、Astro 的使用边界 |
| [内容模型索引](./technical-architecture/content-models.md) | 内容数据的职责分层和各份权威 Schema 入口 |
| [文档内容模型](./technical-architecture/document-content-model.md) | 文档集、文档根页面和普通文档 Frontmatter |
| [作品索引数据](./technical-architecture/work-index-data.md) | 轻量作品 `data.yaml` 的字段与职责边界 |
| [默认作品页 Frontmatter](./technical-architecture/default-work-page-frontmatter.md) | `index.mdx` 字段、标签页来源、完整示例和校验规则 |
| [搜索与图标](./technical-architecture/search-and-icons.md) | Pagefind 搜索方案、搜索元数据、Lucide 与本地 SVG 体系 |
| [国际化与双语路由](./technical-architecture/internationalization.md) | 中文默认路径、英文 `/en` 前缀、对应页面与静态生成边界 |
| [客户端交互与体验层](./technical-architecture/client-interaction-and-experience.md) | React Islands、Astro 与 React 的边界，以及整站沉浸式体验目标 |
| [测试与构建验证](./technical-architecture/testing-and-build.md) | 静态检查、单元测试、产物校验、端到端测试和视觉回归 |

正式实现的阶段顺序、交付边界与逐阶段验收门槛由[完整开发计划与阶段验收](./development-plan.md)统一维护。

其中，[内容模型索引](./technical-architecture/content-models.md) 统一指向以下结构化内容的权威技术定义：

- 文档页面与文档集根页面 Frontmatter。
- `src/content/works/{work}/data.yaml` 作品索引数据。
- `src/content/works/{work}/index.mdx` 默认作品介绍页 Frontmatter。
- 默认作品页“介绍、图库、版本与更新、获取方式”四个标签页的数据来源和显示条件。

## 已确认的关键约束

- 不采用 Starlight。
- 不绕开 Astro 重新开发通用静态网站生成器。
- 不重复实现 Markdown/MDX 解析、内容加载、单条 Schema、类型生成或开发服务器。
- `src/content/site/data.yaml` 是单例配置，不注册为 Content Collection。
- 每件作品必须包含 `data.yaml`，并且只能存在 `index.mdx` 或 `index.astro` 中的一种入口。
- 每个文档集由真实目录和根 `index.md` 或 `index.mdx` 确定，不维护统一栏目或手写完整侧边栏。
- 文档侧边栏、上一篇和下一篇都不能跨文档集。
- Pagefind 在 Astro 生成静态 HTML 后建立全文索引。
- Lucide 是默认语义图标集，作品和品牌图标使用本地 SVG 注册表。
- React 是唯一客户端 UI 框架，不同时引入 Vue、Preact、Svelte 等第二套客户端组件运行时。
- 网站全局支持中文与英文；中文保持无前缀路径，英文统一使用 `/en` 前缀，显式 URL 优先于浏览器缓存中的语言偏好。
- 构建必须校验重复链接、内容边界、资源引用、草稿泄漏和内部链接。

## 实现阶段待校准

以下事项尚未形成最终决定：

- 根据已经确认的视觉稿与首页行为确定每个 React Island 的精确 Hydration 时机。
- 在真实生产场景资产和滚动录屏上校准首页动效参数，不沿用旧原型数值。
- 只有实际设计需求证明 CSS 与轻量脚本不足时，才评估 ClientRouter、动画库或可选 3D 技术。
- 根据视觉系统确定 CSS 架构、设计令牌和响应式实现方式。
- 代码高亮、Markdown 插件与文档增强组件。
- 部署平台、缓存、重定向和 CI 发布流程。

## 技术参考

- [Astro Pages](https://docs.astro.build/en/basics/astro-pages/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Pagefind](https://pagefind.app/docs/)
- [Lucide](https://lucide.dev/)
- [Astro Icon](https://www.astroicon.dev/)
- [Astro Testing](https://docs.astro.build/en/guides/testing/)
- [Playwright](https://playwright.dev/docs/intro)
