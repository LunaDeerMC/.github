import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Menu,
  MoonStar,
  Palette,
  Sun,
  X,
} from "lucide-react";

const themes = {
  light: {
    label: "白天牧场",
    shortLabel: "白天",
    scene: "/assets/scenes/sunlit-pastoral-hero.png",
    sceneAlt: "阳光下的 Minecraft 牧场、麦田、谷仓与远山",
  },
  dark: {
    label: "黄昏工坊",
    shortLabel: "黄昏",
    scene: "/assets/scenes/redstone-dusk-hero.png",
    sceneAlt: "黄昏中的 Minecraft 红石工坊、灯火与远山",
  },
};

const palettes = {
  light: [
    ["页面底色", "#FFF9ED", "canvas"],
    ["作品舞台", "#F6E5C7", "foreground"],
    ["抬升表面", "#FFFFFF", "raised"],
    ["主要文字", "#251D19", "text"],
    ["品牌绿色", "#51752D", "accent"],
    ["边界色", "#C8B999", "border"],
  ],
  dark: [
    ["页面底色", "#1B100F", "canvas"],
    ["作品舞台", "#1F1211", "foreground"],
    ["抬升表面", "#38231F", "raised"],
    ["主要文字", "#FFF7ED", "text"],
    ["红石强调", "#C73E2F", "accent"],
    ["边界色", "#5A4039", "border"],
  ],
};

const workRows = [
  {
    index: "02",
    eyebrow: "服务器基础设施",
    title: "稳定地承托每一次冒险",
    meta: "核心 · 持续维护",
  },
  {
    index: "03",
    eyebrow: "开发者工具",
    title: "把重复工作留给工具",
    meta: "工具链 · 开源",
  },
];

function ThemeSwitch({ theme, setTheme, compact = false }) {
  return (
    <div className={`theme-switch${compact ? " theme-switch--compact" : ""}`}>
      {Object.entries(themes).map(([key, item]) => {
        const Icon = key === "light" ? Sun : MoonStar;
        const selected = theme === key;

        return (
          <button
            className={selected ? "is-selected" : ""}
            key={key}
            type="button"
            aria-label={`切换到${item.label}`}
            aria-pressed={selected}
            onClick={() => setTheme(key)}
          >
            <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
            <span>{compact ? item.shortLabel : item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PalettePanel({ theme, open, onClose }) {
  return (
    <aside
      className={`palette-panel${open ? " is-open" : ""}`}
      aria-hidden={!open}
      aria-label={`${themes[theme].label}色板`}
    >
      <div className="palette-panel__header">
        <div>
          <span className="eyebrow">当前语义色板</span>
          <h2>{themes[theme].label}</h2>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={onClose}
          aria-label="关闭色板"
        >
          <X aria-hidden="true" size={19} />
        </button>
      </div>

      <div className="palette-list">
        {palettes[theme].map(([label, hex, token]) => (
          <div className="palette-row" key={token}>
            <span
              className="palette-swatch"
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
            <span>
              <strong>{label}</strong>
              <small>{token}</small>
            </span>
            <code>{hex}</code>
          </div>
        ))}
      </div>

      <p className="palette-note">
        这是已经确认的页面配色基线；后续页面与正式场景资产将沿用这组语义关系。
      </p>
    </aside>
  );
}

export function App() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("lunadeer-theme-lab");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("lunadeer-theme-lab", theme);
  }, [theme]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setPaletteOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" data-theme={theme}>
      <header className="site-header">
        <nav className="site-nav" aria-label="主导航">
          <div className="nav-group nav-group--brand">
            <a className="wordmark" href="#top" aria-label="LunaDeerMC 首页">
              LunaDeerMC
            </a>
            <a className="nav-link nav-link--desktop" href="#support">
              支持
            </a>
            <a className="nav-link nav-link--desktop" href="#about">
              关于
            </a>
          </div>

          <div className="nav-group nav-group--actions">
            <a className="nav-link nav-link--desktop" href="#works">
              作品
            </a>
            <a className="nav-link nav-link--desktop" href="#docs">
              文档
            </a>
            <ThemeSwitch theme={theme} setTheme={setTheme} compact />
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? "关闭功能菜单" : "打开功能菜单"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? (
                <X aria-hidden="true" size={20} />
              ) : (
                <Menu aria-hidden="true" size={20} />
              )}
            </button>
          </div>
        </nav>

        <div className={`utility-menu${menuOpen ? " is-open" : ""}`}>
          <div className="utility-menu__inner">
            <span className="eyebrow">快速前往</span>
            <div className="utility-menu__links">
              <a href="#works" onClick={closeMenu}>
                作品
              </a>
              <a href="#docs" onClick={closeMenu}>
                文档
              </a>
              <a href="#support" onClick={closeMenu}>
                支持
              </a>
              <a href="#about" onClick={closeMenu}>
                关于
              </a>
            </div>
            <div className="utility-menu__theme">
              <span>视觉场景</span>
              <ThemeSwitch theme={theme} setTheme={setTheme} />
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-scenes">
            {Object.entries(themes).map(([key, item]) => (
              <img
                className={`hero-scene${theme === key ? " is-active" : ""}`}
                key={key}
                src={item.scene}
                alt={theme === key ? item.sceneAlt : ""}
                aria-hidden={theme !== key}
              />
            ))}
          </div>

          <div className="hero-inner">
            <div className="hero-copy">
              <span className="hero-kicker">{themes[theme].label}</span>
              <h1>LunaDeerMC</h1>
              <p className="hero-slogan">
                To the moon, to the dream, to the future!
              </p>
              <p className="hero-description">
                打造稳定、开放且值得长期使用的 Minecraft
                作品，也把构建它们的经验留在这里。
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#works">
                  浏览作品
                  <ArrowDown aria-hidden="true" size={17} />
                </a>
                <a className="button button--quiet" href="#docs">
                  阅读文档
                  <ArrowRight aria-hidden="true" size={17} />
                </a>
              </div>
            </div>
          </div>

          <a className="scroll-cue" href="#works" aria-label="向下查看精选作品">
            <span>Selected work</span>
            <ArrowDown aria-hidden="true" size={16} />
          </a>
        </section>

        <section className="featured-section" id="works">
          <div className="section-inner">
            <header className="section-heading">
              <div>
                <span className="eyebrow">Selected work</span>
                <h2>精选作品</h2>
              </div>
              <p>
                从服务端插件到开发工具，我们更看重清楚的边界、稳定的体验和长期维护。
              </p>
            </header>

            <article className="featured-work">
              <span className="work-number">01</span>
              <div className="featured-work__content">
                <span className="eyebrow">领地管理 · 开源插件</span>
                <h3>Dominion</h3>
                <p>
                  一套面向 Minecraft
                  服务器的现代领地管理方案，让玩家拥有自己的空间，也让服主更轻松地维护秩序。
                </p>
                <a className="text-link" href="#docs">
                  了解这个作品
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              </div>
              <dl className="work-facts">
                <div>
                  <dt>方向</dt>
                  <dd>玩家自治</dd>
                </div>
                <div>
                  <dt>状态</dt>
                  <dd>
                    <Check aria-hidden="true" size={15} />
                    持续维护
                  </dd>
                </div>
                <div>
                  <dt>开放</dt>
                  <dd>源代码与文档</dd>
                </div>
              </dl>
            </article>

            <div className="work-index">
              {workRows.map((work) => (
                <a className="work-row" href="#docs" key={work.index}>
                  <span className="work-number">{work.index}</span>
                  <span className="work-row__copy">
                    <small>{work.eyebrow}</small>
                    <strong>{work.title}</strong>
                  </span>
                  <span className="work-row__meta">{work.meta}</span>
                  <ArrowUpRight aria-hidden="true" size={19} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="knowledge-section" id="docs">
          <div className="section-inner knowledge-grid">
            <div className="knowledge-intro">
              <span className="eyebrow">Knowledge base</span>
              <h2>作品之外，留下可以复用的知识。</h2>
              <p>
                文档不只是功能说明。它也是设计决策、实践经验与常见问题的长期索引。
              </p>
            </div>

            <div className="knowledge-links">
              <a href="#support">
                <BookOpen aria-hidden="true" size={22} />
                <span>
                  <small>开始使用</small>
                  <strong>从安装到第一次配置</strong>
                </span>
                <ArrowRight aria-hidden="true" size={19} />
              </a>
              <a href="#support">
                <BookOpen aria-hidden="true" size={22} />
                <span>
                  <small>深入理解</small>
                  <strong>概念、权限与最佳实践</strong>
                </span>
                <ArrowRight aria-hidden="true" size={19} />
              </a>
              <a href="#support">
                <BookOpen aria-hidden="true" size={22} />
                <span>
                  <small>参与贡献</small>
                  <strong>开发指南与项目约定</strong>
                </span>
                <ArrowRight aria-hidden="true" size={19} />
              </a>
            </div>
          </div>
        </section>

        <section className="support-section" id="support">
          <div className="section-inner support-grid">
            <div>
              <span className="eyebrow">Support</span>
              <h2>遇到问题？从这里开始。</h2>
            </div>
            <p>
              先查阅文档与常见问题；如果仍然没有答案，可以带着版本、日志和复现步骤来找我们。
            </p>
            <a className="button button--outline" href="#top">
              查看支持入口
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-inner about-grid">
            <span className="eyebrow">About LunaDeerMC</span>
            <blockquote>
              “做值得长久使用的作品，也认真记录抵达它的每一步。”
            </blockquote>
            <p>
              我们是一群 Minecraft 创作者与开发者。对代码的可靠性、交互的清晰度，以及社区中的真实使用体验抱有同样的耐心。
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-inner footer-inner">
          <div>
            <a className="wordmark" href="#top">
              LunaDeerMC
            </a>
            <p>To the moon, to the dream, to the future!</p>
          </div>
          <div className="footer-links">
            <a href="#works">作品</a>
            <a href="#docs">文档</a>
            <a href="#support">支持</a>
            <a href="#about">关于</a>
          </div>
          <small>© 2026 LunaDeerMC</small>
        </div>
      </footer>

      <button
        className="palette-trigger"
        type="button"
        onClick={() => setPaletteOpen((value) => !value)}
        aria-expanded={paletteOpen}
      >
        <Palette aria-hidden="true" size={18} />
        <span>查看色值</span>
      </button>

      <PalettePanel
        theme={theme}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
