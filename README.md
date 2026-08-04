# LunaDeerMC 官网

LunaDeerMC 官网是一个使用 Astro 构建的纯静态品牌官网、作品展示站与文档站。当前仓库已完成信息架构、视觉系统、内容模型和技术架构的设计基线，正式站点源码将在后续开发阶段按计划建立。

## 当前状态

- 已确认浅色“白天牧场”与深色“黄昏红石工坊”双主题。
- 已确认首页四层 Minecraft 单场景视差、精选作品同色过渡和完整内容顺序。
- 已确认 Astro、Content Collections、按需 React Islands、Pagefind 与分层测试方案。
- 已确认作品、文档、支持、关于、导航、页脚与搜索的职责边界。
- `prototypes/` 中的原型只记录设计判断与交互验证，不是正式站点源码。

## 事实源

- [官网设计说明](./design/website-design-spec.md)
- [视觉设计索引](./design/README.md)
- [技术架构](./design/technical-architecture/README.md)
- [完整开发计划与阶段验收](./design/development-plan.md)

## 品牌资产

官方 Logo 必须直接使用 [`design/assets/lunadeermc-brand-logo.png`](./design/assets/lunadeermc-brand-logo.png) 原始 RGBA 文件。不得重绘、改色、反相、描边或生成主题变体。

## 原型

- `prototypes/homepage-duskmoon/`：早期四层视差机制验证，视觉与参数未通过正式验收。
- `prototypes/homepage-theme-lab/`：双主题气质和语义色板验证。
- `prototypes/works-layout-lab/`：作品目录布局与交互验证，作品数据均为示例。
- `prototypes/footer-transition-poc/`：最后内容、Horizon Veil 与统一页脚的过渡验证。
- `prototypes/visual-directions/`：已选视觉方向与历史探索资产。

依赖、框架缓存和构建产物由根目录 `.gitignore` 排除，不属于设计证据或源码基线。
