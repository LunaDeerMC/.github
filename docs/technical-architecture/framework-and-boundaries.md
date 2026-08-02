# 框架选择与架构边界

> 返回[技术架构入口](../technical-architecture.md)。

- 最后更新：2026-07-22
- 状态：已确认

## 技术方向

使用 **Astro** 作为静态网站框架，以 **Astro Content Collections** 作为底层内容基础设施，在其上自研 LunaDeerMC 专用的内容领域层和文档阅读层；不采用 Starlight，也不开发独立于 Astro 的通用内容系统或静态网站生成器。

## 职责划分

### Astro

Astro 负责通用网站基础能力：

- 开发服务器与热更新。
- 静态路由和页面生成。
- Markdown/MDX 集成。
- 组件渲染。
- CSS、JavaScript、图片和其他资源的构建与打包。
- 最终静态 HTML、CSS、JavaScript 和资源文件的输出。

### React 客户端界面

React 是项目唯一的客户端 UI 框架，通过 Astro Islands 按需用于需要浏览器状态、异步数据或高级视觉交互的区域。React 不接管全站路由、内容加载或页面主体渲染，也不把网站改造成全量 Hydration 的 React SPA。

- Astro 页面、布局和静态内容继续使用 `.astro`。
- 需要客户端运行的交互与视觉组件使用 `.tsx`，由 `.astro` 页面或组件显式导入并选择 Hydration 时机。
- 自定义作品主页仍以 `index.astro` 作为入口，可以在内部组合当前作品专属的 React Islands。
- 不同时引入 Vue、Preact、Svelte 等第二套客户端 UI 框架，避免重复运行时和多套组件心智模型。
- React 组件接收内容领域层已经标准化的数据，不自行扫描内容源或复制领域校验逻辑。

### Astro Content Collections

Content Collections 负责可复用的底层内容能力：

- 加载 Markdown、MDX、YAML 等内容源。
- 读取 Frontmatter，并通过 Schema 校验单条内容的数据结构。
- 为内容数据提供 TypeScript 类型和统一查询接口。
- 提供内容渲染、构建缓存和开发期更新能力。
- 作为文档内容与作品基础数据的首选加载机制。

`src/content/site/data.yaml` 不放入 Content Collections。它是全站唯一的单例配置，不属于可枚举内容集合，由 `loadSiteConfig()` 直接读取，并使用独立 Schema 校验后输出类型化的 `SiteConfig`。

### LunaDeerMC 内容领域层

内容领域层只实现项目特有、Content Collections 不理解的业务语义和跨内容规则：

- 将同一作品目录中的 `data.yaml`、默认 MDX 介绍页或 Astro 自定义主页聚合为统一作品记录。
- 使用 `import.meta.glob()` 加载不能作为 Content Collection 条目处理的 `index.astro` 自定义主页。
- 识别文档集边界，并将文档条目聚合为独立文档集。
- 计算文档永久链接并生成静态路由清单。
- 根据每个文档集的真实目录生成独立侧边栏。
- 在文档集内部计算上一篇和下一篇。
- 校验重复永久链接、作品入口冲突、缺失资源、无效内部链接和文档集越界等跨文件约束。
- 为搜索索引、站点地图和构建校验提供标准化内容数据。

### LunaDeerMC 文档阅读层

文档阅读层负责：

- 文档阅读布局。
- 文档集身份区域。
- 左侧文档侧边栏。
- 正文标题、图标与面包屑。
- 右侧本页目录。
- 上一篇和下一篇。
- 移动端文档工具栏与目录抽屉。
- Markdown/MDX 正文组件及其视觉规范。

## 架构关系

```text
Astro
├── 通用静态网站能力
│   ├── 路由
│   ├── 静态生成
│   ├── 开发服务器
│   ├── MD/MDX 集成
│   └── 资源构建
│
├── Astro Content Collections
│   ├── 内容加载
│   ├── 单条内容 Schema
│   ├── 类型与查询
│   ├── 内容渲染
│   └── 缓存与开发期更新
│
├── LunaDeerMC 专用内容领域层
│   ├── 作品目录聚合
│   ├── MDX 与 Astro 入口统一
│   ├── 路由清单
│   ├── 文档集与侧边栏
│   ├── 页面前后关系
│   ├── 跨内容校验
│   └── 搜索与站点地图数据
│
└── LunaDeerMC 界面层
    ├── Astro 官网页面与静态内容
    ├── React 客户端交互与体验 Islands
    ├── 默认作品介绍页
    ├── 自定义作品主页
    └── 文档阅读层
```

内容处理与界面渲染必须解耦。组件不直接扫描文件系统；Content Collections 条目和 `index.astro` 模块先由内容领域层聚合、校验并生成标准化数据，再交给 Astro 页面和组件渲染。

## 明确不做

- 不采用 Starlight 作为文档主题或文档引擎。
- 不在 Vite 或其他底层构建工具上重新开发完整静态网站生成器。
- 不绕开 Content Collections 重新实现文件扫描、Markdown/MDX 加载、Frontmatter 读取、单条内容 Schema、类型生成、内容查询、构建缓存或开发期更新。
- 不自行开发 Markdown/MDX 解析器、代码高亮器、资源打包器或开发服务器。
- 不将自研内容领域层设计为面向其他项目发布的通用框架。
- 不以复制 VitePress、Docusaurus 或 Starlight 的全部功能为目标。
- 不将官网整体实现为全量 Hydration 的 React SPA，也不并存多个客户端 UI 框架。

## 选择原因

- 作品介绍页同时需要默认 MDX 骨架和 Astro 原生自定义主页。
- 文档以作品或通用主题为独立文档集，侧边栏和上一篇/下一篇不能跨文档集。
- 文档 Frontmatter 包含项目专用的 `icon` 与 `link` 规则。
- 官网和文档需要共用同一套品牌设计系统，而不是让官网适配现成文档主题。
- Content Collections 已提供内容加载、类型和单条 Schema 等成熟基础能力，没有必要重复开发；但它不理解作品目录聚合、独立文档集、永久链接和跨文件约束，因此仍然需要专用领域层。
- 当前需求范围明确，没有必要承担一个通用静态网站生成器的长期维护成本。

## 预期代价

- 需要自行开发和测试文档侧边栏、分页、移动端导航与正文组件。
- 需要在 Content Collections Schema 之外建立严格的跨内容构建校验。
- 搜索、代码块和 Markdown 扩展仍需选择合适的成熟工具并进行集成。
- Astro 或 Content Collections 升级时，需要验证内容领域层和静态路由生成。
