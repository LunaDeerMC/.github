# 作品索引数据

> 返回[内容模型索引](./content-models.md)。

- 最后更新：2026-08-02
- 状态：已确认

## 职责

`src/content/works/{work}/data.yaml` 是作品的轻量索引记录，不是作品介绍页的完整内容模型。它只保存作品列表、首页精选、全站搜索、默认 SEO、兼容性索引、文档关联和归档状态需要的稳定字段。

## 最终结构

```yaml
name: Example Work
summary:
  zh-CN: 用于作品列表、搜索和 SEO 的一句说明
  en: A concise description for listings, search, and SEO

type: plugin                    # plugin | core | tool | component
accessModel: freemium           # free | paid | freemium
lifecycle: active               # early-access | active | archived

featured: true
publishedAt: 2026-07-18

icon: local:works/example-work

cover:
  src: ./assets/cover.webp
  alt:
    zh-CN: Example Work 封面
    en: Example Work cover

compatibility:
  minecraft:
    - "1.21.x"
  platforms:
    - Paper
    - Folia

docs:
  root: plugins/example-work

archive:
  archivedAt: null
  note: null
  replacement: null
```

本文件使用以下本地化文本结构：

```ts
interface LocalizedText {
  "zh-CN": string;
  en: string;
}
```

## 字段边界

- 始终必填的顶层字段为 `name`、`summary`、`type`、`accessModel`、`lifecycle`、`publishedAt`、`icon` 和 `cover`。
- `featured` 可选，缺省值为 `false`。
- 作品目录名直接作为作品 ID，并生成 `/works/{work}/` 路由；`data.yaml` 不重复填写 `id`、`slug` 或介绍页链接。目录名必须使用全站唯一的小写 kebab-case。
- 不同作品可以使用相同的 `name`、`cover`、GitHub 仓库或文档集；这些字段不参与作品身份唯一性判断。
- `name` 是跨语言共用的作品品牌名称，不翻译；`summary` 是列表、搜索和默认 SEO 使用的双语一句话摘要。
- `name` 必须是去除首尾空白后仍非空的单行纯文本；`summary.zh-CN` 与 `summary.en` 分别执行相同规则。三者都不允许 Markdown、HTML 或换行。标准化过程只处理内存数据，不改写源文件。
- `type` 只允许 `plugin`、`core`、`tool` 和 `component`。
- `accessModel` 只允许 `free`、`paid` 和 `freemium`，只表达全站筛选需要的访问模式。
- `lifecycle` 只允许 `early-access`、`active` 和 `archived`。
- `featured` 只表示作品进入首页精选候选集合，不保证每次访问都可见，也不表达首页内的固定排序或主次。
- 首页静态构建保留全部 `featured: true` 候选；浏览器每次加载首页时随机展示最多三件并随机排列。同一页面生命周期内滚动、主题切换和断点变化不重新抽样。
- `featured` 候选为空是合法状态，首页完整省略精选作品内容；候选超过三件也是合法状态，不在构建时截断或产生数量警告。
- `publishedAt` 用于作品列表等需要稳定顺序的场景和无 JavaScript 精选回退，不参与增强后的首页随机主次判断。
- `publishedAt` 与 `archive.archivedAt` 统一使用 `YYYY-MM-DD` 的纯日期格式，不进行时区换算。构建系统只校验日期是否合法，不限制两者先后顺序，也允许未来日期。
- `icon` 和 `cover` 是必需的跨页面展示数据；`cover.src` 必填，可以使用当前作品目录内的本地相对路径或 HTTPS 远程图片 URL。`cover.alt` 是可选的 `LocalizedText`，省略时两种语言最终都输出 `alt=""` 并作为装饰性封面处理；一旦提供就必须同时包含中文和英文。
- `compatibility` 整体可选，只包含 `minecraft` 与 `platforms`；不记录或展示 Java 版本。存在时至少包含一个非空数组。
- `minecraft` 与 `platforms` 接受任意非空字符串，不使用版本正则、平台白名单或跨字段兼容性推断。字符串去除首尾空白后保留原有大小写与顺序。
- 完全相同的重复兼容性值产生 Warning，标准化记录只保留第一次出现的值；空字符串仍属于无效已知值并导致构建失败。
- `docs.root` 是可选文档集关联。存在即表示作品提供公开文档，分类由路径首段推导，不再增加 `enabled` 或 `category`。
- 关联方向固定为作品指向文档集：一件作品通过单个 `docs.root` 最多关联一个文档集；文档集不保存反向作品引用，也不要求必须被作品关联。
- 多件作品可以引用同一个文档集，构建系统不对文档集建立反向唯一性约束。
- `docs.root` 的分类必须与作品类型严格对应：`plugin → plugins`、`core → cores`、`tool/component → tools`。作品不得关联到 `general`；`general` 只保存不隶属于具体作品的通用文档集。
- `archive` 只服务归档索引、说明和替代作品关联。非归档作品可以省略，也可以保留三个字段全部为 `null` 的空对象，标准化后统一视为未配置；归档作品必须提供归档日期和双语 `note`，替代作品可选但必须真实存在。

语言无关字段包括 `name`、类型与状态枚举、日期、图标、图片路径、兼容性值、文档集标识和替代作品 ID。需要双语的字段仅为 `summary`、可选 `cover.alt` 和归档时必填的 `archive.note`。

以下内容不进入作品索引数据：

- 具体获取渠道和价格。
- 源码状态、仓库地址和 GitHub Releases。
- 支持链接和介绍页按钮。
- 功能说明、图库、正文顺序和页面特效。
- 某一张自定义介绍页专用的视觉配置。

默认 `index.mdx` 在自己的 Frontmatter 中提供默认骨架需要的页面专属结构化配置；`index.astro` 直接以 Astro 源码自由实现。两种介绍页都可以读取 `data.yaml`，但不得要求索引文件为具体页面设计提供完整内容模型。

## 构建校验

- `data.yaml` 只提取本页定义的已知字段。未知的顶层或嵌套字段产生 Warning 并被标准化记录忽略，不导致构建失败，也不会从源文件中自动删除。
- 必填字段缺失、已知字段类型错误、枚举值无效或违反下列一致性规则时构建失败。
- 必填的 `LocalizedText` 必须同时包含非空 `zh-CN` 与 `en`。可选本地化字段可以整体省略，但一旦存在也必须包含两种语言；出现其他未知 locale 键只产生 Warning 并被忽略。
- 文本字段不设置硬性字符数上限；页面组件负责合理换行、截断和响应式展示。
- 每个作品目录必须包含 `data.yaml`，并且只能存在 `index.mdx` 或 `index.astro` 中的一种入口。
- 作品目录名必须符合全站唯一的小写 kebab-case。
- `docs.root` 必须指向真实文档集。
- 未被任何作品引用的文档集是合法内容，不产生错误或警告；同一文档集被多件作品引用也不因关联关系本身报错。
- `docs.root` 的首段必须符合 `plugin → plugins`、`core → cores`、`tool/component → tools`；分类不匹配或指向 `general` 时构建失败。
- `cover`、`cover.src` 和 `icon` 缺失时构建失败；`cover.alt` 缺失是合法情况。
- 本地 `cover.src` 不允许通过 `..` 越出当前作品目录，并且目标文件必须存在，否则构建失败。
- 远程 `cover.src` 必须是合法 HTTPS URL；构建时不检查远程图片是否可访问，网络失败不影响构建。
- 精选候选数量不属于构建错误：零件、少于三件或多于三件均可正常生成；随机展示只消费已经通过内容校验的标准化记录。
- 非归档作品的 `archive` 如果包含任意非空值则构建失败；三个字段全部为 `null` 时允许并规范化为未配置。
- `lifecycle: archived` 时必须提供归档日期和双语说明。
- `archive.replacement` 存在时必须指向另一件真实作品，不能指向当前作品自身；替代作品也已归档时只产生 Warning。
- 不校验 `publishedAt` 与 `archive.archivedAt` 的先后顺序，不因日期位于未来而报错或警告。
- `early-access` 和 `active` 的默认作品页必须提供获取方式；`archived` 可以省略 `acquisition`。
- `accessModel` 必须与默认作品页的全部获取档次一致；其中 `paid` 的所有档次都必须付费。具体规则见[默认作品页 Frontmatter](./default-work-page-frontmatter.md)。
- 上述 `acquisition` 一致性规则只适用于使用 `index.mdx` 的默认作品页。使用 `index.astro` 时，`accessModel` 继续服务全站列表和搜索，但构建系统不要求自定义主页导出结构化获取数据，也不分析源码中的获取入口。
