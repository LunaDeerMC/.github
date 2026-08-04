# LunaDeerMC 页脚过渡 POC

这个原型只验证“最后内容 → Horizon Veil → 统一页脚”的视觉关系，不是正式网站实现。

## 本地预览

从仓库根目录运行：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://127.0.0.1:4173/prototypes/footer-transition-poc/
```

页面顶部可以切换浅色 / 深色主题；调整浏览器宽度即可观察桌面、平板和移动端的收束变化。

## 复用资产

- 场景：`../homepage-theme-lab/public/assets/scenes/`
- Logo：`../../design/assets/lunadeermc-brand-logo.png`

场景只作为低对比度地平线过渡，页脚文案和 Logo 位于稳定页脚表面。
