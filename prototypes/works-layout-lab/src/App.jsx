import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowRight,
  Boxes,
  Braces,
  CircuitBoard,
  CloudCog,
  Coins,
  ExternalLink,
  Library,
  Map,
  Menu,
  MessageSquare,
  Moon,
  Search,
  ShieldCheck,
  Signpost,
  Sun,
  Wrench,
  X,
} from "lucide-react";

const filters = [
  { id: "all", label: "全部" },
  { id: "plugin", label: "插件" },
  { id: "core", label: "服务端核心" },
  { id: "tool", label: "开发工具" },
];

const works = [
  {
    id: "dominion",
    name: "Dominion",
    type: "plugin",
    typeLabel: "插件",
    status: "active",
    statusLabel: "维护中",
    version: "2.3.4",
    compatibility: "1.16.5 – 1.21",
    updated: "2026-07-18",
    icon: ShieldCheck,
    summary: "功能强大且易于使用的领地管理插件，轻松创建、管理与保护你的领地。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "luna-core",
    name: "LunaCore",
    type: "core",
    typeLabel: "服务端核心",
    status: "active",
    statusLabel: "维护中",
    version: "1.8.2",
    compatibility: "1.20.4 – 1.21",
    updated: "2026-07-11",
    icon: Boxes,
    summary: "面向长期运行服务器的轻量核心，提供稳定、清晰且可扩展的基础能力。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "luna-api",
    name: "LunaAPI",
    type: "tool",
    typeLabel: "开发工具",
    status: "active",
    statusLabel: "维护中",
    version: "3.1.0",
    compatibility: "Java 21",
    updated: "2026-06-29",
    icon: Braces,
    summary: "统一常用开发能力与接口约定，减少插件之间重复而脆弱的基础实现。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "economy-lite",
    name: "EconomyLite",
    type: "plugin",
    typeLabel: "插件",
    status: "active",
    statusLabel: "维护中",
    version: "1.5.7",
    compatibility: "1.18 – 1.21",
    updated: "2026-06-20",
    icon: Coins,
    summary: "保持简单边界的服务器经济组件，为其他作品提供可靠的账户与交易能力。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "more-tools",
    name: "MoreTools",
    type: "plugin",
    typeLabel: "插件",
    status: "testing",
    statusLabel: "测试中",
    version: "0.9.0",
    compatibility: "1.21",
    updated: "2026-07-03",
    icon: Wrench,
    summary: "围绕生存体验扩展工具行为，在熟悉的规则里提供更顺手的操作方式。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "warp-plus",
    name: "WarpPlus",
    type: "plugin",
    typeLabel: "插件",
    status: "active",
    statusLabel: "维护中",
    version: "2.0.1",
    compatibility: "1.19 – 1.21",
    updated: "2026-05-26",
    icon: Signpost,
    summary: "为玩家与管理员提供层级清晰的传送点管理，不让常用功能变成复杂菜单。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "auto-backup",
    name: "AutoBackup",
    type: "tool",
    typeLabel: "开发工具",
    status: "active",
    statusLabel: "维护中",
    version: "4.2.0",
    compatibility: "Linux / Windows",
    updated: "2026-07-22",
    icon: Archive,
    summary: "可观察、可验证的自动备份工具，把最重要的恢复路径留在真正需要的时候。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "chat-control",
    name: "ChatControl",
    type: "plugin",
    typeLabel: "插件",
    status: "active",
    statusLabel: "维护中",
    version: "1.6.3",
    compatibility: "1.17 – 1.21",
    updated: "2026-06-08",
    icon: MessageSquare,
    summary: "以可理解的规则维护聊天秩序，同时为社区留下足够自然的交流空间。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "region-market",
    name: "RegionMarket",
    type: "plugin",
    typeLabel: "插件",
    status: "planned",
    statusLabel: "计划中",
    version: "—",
    compatibility: "规划中",
    updated: "2026-05-12",
    icon: Map,
    summary: "连接领地与玩家交易的轻量市场构想，目前仍处于公开设计阶段。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "luna-lib",
    name: "LunaLib",
    type: "tool",
    typeLabel: "开发工具",
    status: "active",
    statusLabel: "维护中",
    version: "2.7.1",
    compatibility: "Java 17+",
    updated: "2026-06-15",
    icon: Library,
    summary: "一组经过实际项目验证的通用模块，服务于可维护的 Minecraft 开发流程。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "packet-utils",
    name: "PacketUtils",
    type: "tool",
    typeLabel: "开发工具",
    status: "planned",
    statusLabel: "计划中",
    version: "—",
    compatibility: "规划中",
    updated: "2026-04-26",
    icon: CircuitBoard,
    summary: "让常见数据包操作拥有清楚的类型和错误边界，降低底层开发的意外成本。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
  {
    id: "cloud-console",
    name: "CloudConsole",
    type: "core",
    typeLabel: "服务端核心",
    status: "testing",
    statusLabel: "测试中",
    version: "0.6.2",
    compatibility: "Web / Java",
    updated: "2026-07-07",
    icon: CloudCog,
    summary: "围绕多实例服务器的状态与操作入口，提供一个安静、可靠的管理基础。",
    imageLight: "/assets/works/dominion-pastoral.png",
    imageDark: "/assets/works/redstone-foundry.png",
  },
];

function ThemeControl({ theme, onChange }) {
  return (
    <div className="theme-control" aria-label="主题选择">
      <button
        type="button"
        className={theme === "light" ? "is-selected" : ""}
        aria-label="切换到白天牧场主题"
        aria-pressed={theme === "light"}
        onClick={() => onChange("light")}
      >
        <Sun aria-hidden="true" size={17} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className={theme === "dark" ? "is-selected" : ""}
        aria-label="切换到黄昏工坊主题"
        aria-pressed={theme === "dark"}
        onClick={() => onChange("dark")}
      >
        <Moon aria-hidden="true" size={17} strokeWidth={1.8} />
      </button>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("lunadeer-works-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("dominion");
  const [menuOpen, setMenuOpen] = useState(false);
  const detailRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("lunadeer-works-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const visibleWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return works.filter((work) => {
      const matchesFilter =
        activeFilter === "all" || work.type === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${work.name} ${work.typeLabel} ${work.summary}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  useEffect(() => {
    if (
      visibleWorks.length > 0 &&
      !visibleWorks.some((work) => work.id === selectedId)
    ) {
      setSelectedId(visibleWorks[0].id);
    }
  }, [selectedId, visibleWorks]);

  const selectedWork =
    works.find((work) => work.id === selectedId) ?? visibleWorks[0] ?? works[0];

  const selectWork = (id) => {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 760px)").matches) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="site-header">
        <nav className="site-nav" aria-label="主导航">
          <div className="nav-group nav-group--brand">
            <a className="wordmark" href="#top">
              LunaDeerMC
            </a>
            <a className="nav-link nav-link--desktop" href="#support">
              支持
            </a>
            <a className="nav-link nav-link--desktop" href="#about">
              关于
            </a>
          </div>
          <div className="nav-group nav-group--content">
            <a className="nav-link nav-link--desktop is-current" href="#top">
              作品
            </a>
            <a className="nav-link nav-link--desktop" href="#docs">
              文档
            </a>
            <ThemeControl theme={theme} onChange={setTheme} />
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
            <span>快速前往</span>
            <a href="#top" onClick={() => setMenuOpen(false)}>
              作品
            </a>
            <a href="#docs" onClick={() => setMenuOpen(false)}>
              文档
            </a>
            <a href="#support" onClick={() => setMenuOpen(false)}>
              支持
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              关于
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="page-intro">
          <div>
            <span className="eyebrow">Works directory</span>
            <h1>作品</h1>
            <p>为 Minecraft 社区构建可靠易用的插件、服务端核心与开发工具。</p>
          </div>
          <label className="search-field">
            <Search aria-hidden="true" size={20} />
            <span className="sr-only">搜索作品</span>
            <input
              type="search"
              placeholder="搜索作品"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="清除搜索"
                onClick={() => setQuery("")}
              >
                <X aria-hidden="true" size={17} />
              </button>
            )}
          </label>
        </section>

        <section className="works-workspace" aria-label="作品浏览器">
          <div className="directory">
            <div className="filters" role="group" aria-label="作品类型">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  className={activeFilter === filter.id ? "is-active" : ""}
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="work-list" aria-live="polite">
              {visibleWorks.length > 0 ? (
                visibleWorks.map((work) => {
                  const Icon = work.icon;
                  const isSelected = selectedWork.id === work.id;
                  return (
                    <button
                      type="button"
                      className={`work-row${isSelected ? " is-selected" : ""}`}
                      key={work.id}
                      aria-pressed={isSelected}
                      onClick={() => selectWork(work.id)}
                    >
                      <Icon
                        className="work-row__icon"
                        aria-hidden="true"
                        size={22}
                        strokeWidth={1.7}
                      />
                      <strong>{work.name}</strong>
                      <span>{work.typeLabel}</span>
                      <span className={`status status--${work.status}`}>
                        {work.statusLabel}
                      </span>
                      <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  );
                })
              ) : (
                <div className="empty-state">
                  <Search aria-hidden="true" size={24} />
                  <strong>没有找到相符作品</strong>
                  <p>试试更短的关键词，或切换到“全部”。</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveFilter("all");
                    }}
                  >
                    清除条件
                  </button>
                </div>
              )}
            </div>
            <p className="work-count">共 {visibleWorks.length} 件作品</p>
          </div>

          <article className="work-detail" ref={detailRef} tabIndex="-1">
            <div className="work-media">
              <img
                src={
                  theme === "light"
                    ? selectedWork.imageLight
                    : selectedWork.imageDark
                }
                alt={`${selectedWork.name} 的 Minecraft 场景预览`}
              />
            </div>

            <div className="detail-heading">
              <div>
                <span className="eyebrow">{selectedWork.typeLabel}</span>
                <h2>{selectedWork.name}</h2>
              </div>
              <p>{selectedWork.summary}</p>
            </div>

            <dl className="detail-facts">
              <div>
                <dt>类别</dt>
                <dd>{selectedWork.typeLabel}</dd>
              </div>
              <div>
                <dt>当前版本</dt>
                <dd>{selectedWork.version}</dd>
              </div>
              <div>
                <dt>兼容版本</dt>
                <dd>{selectedWork.compatibility}</dd>
              </div>
              <div>
                <dt>作者</dt>
                <dd>LunaDeerMC Team</dd>
              </div>
              <div>
                <dt>最后更新</dt>
                <dd>{selectedWork.updated}</dd>
              </div>
              <div>
                <dt>维护状态</dt>
                <dd className={`status status--${selectedWork.status}`}>
                  {selectedWork.statusLabel}
                </dd>
              </div>
            </dl>

            <a className="primary-action" href="#preview">
              查看作品
              <ExternalLink aria-hidden="true" size={17} />
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}
