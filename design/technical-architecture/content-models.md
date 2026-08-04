# 内容模型索引

> 返回[技术架构入口](./README.md)。本页只说明内容分层并索引各份权威 Schema，避免在一个文件中同时维护全部内容模型。

- 最后更新：2026-07-22
- 状态：已确认

## 内容层次

结构化内容分为以下职责：

1. `src/content/site/data.yaml`：全站唯一配置，由 `loadSiteConfig()` 加载。
2. `src/content/works/{work}/data.yaml`：轻量作品索引，服务首页、列表、搜索、SEO、兼容性和文档关联。
3. `src/content/works/{work}/index.mdx`：默认作品介绍页的结构化页面数据与“介绍”正文。
4. `src/content/works/{work}/index.astro`：特殊作品的完全自定义主页。
5. `docs/{category}/{documentSet}/`：彼此独立的文档集。

`data.yaml` 不承担某张作品介绍页的完整内容模型。默认 `index.mdx` 使用页面专属 Frontmatter；自定义 `index.astro` 可以自由实现，但两种入口都读取相同的作品索引记录。

## 专题文档

| 文档 | 权威内容 |
| --- | --- |
| [文档内容模型](./document-content-model.md) | 文档集识别、根页面元数据、普通文档 Frontmatter |
| [作品索引数据](./work-index-data.md) | `src/content/works/{work}/data.yaml` 的字段与职责边界 |
| [默认作品页 Frontmatter](./default-work-page-frontmatter.md) | `index.mdx` 的最终字段、标签页来源、示例与校验规则 |

## 跨模型原则

- 同一事实只在一个权威数据源中维护，界面层不复制内容数据。
- `data.yaml` 与默认作品页 `index.mdx` 使用开放对象校验：构建系统只提取已定义字段，未知字段产生包含完整字段路径的 Warning，但不阻止构建。
- 已知字段缺少必填值、类型错误、枚举值无效或违反跨字段约束时仍然构建失败；未知字段不会进入标准化内容记录。
- 已知文本字段在标准化记录中去除首尾空白，但不自动改写源文件。必填文本规范化后为空时构建失败。
- 结构化文本保持纯文本，不嵌入 Markdown 或 HTML；富文本只进入 MDX 正文或独立文档。内容模型不设置硬性字符数上限。
- 参与首页、列表、搜索、SEO 或全站关联的数据才进入作品 `data.yaml`。
- 只服务默认作品介绍页的数据进入 `index.mdx` Frontmatter。
- `index.mdx` 正文只作为默认作品页的“介绍”内容，不控制整体布局。
- 文档集身份来自根 `index.md` 或 `index.mdx`，不增加文档集 `data.yaml`。
- 跨文件一致性由 LunaDeerMC 内容领域层在构建时校验，而不是交给页面组件临时判断。
