import { expect, test } from "@playwright/test";

test("homepage exposes bilingual navigation, theme controls, and search", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LunaDeerMC", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "浏览作品" })).toHaveAttribute("href", "/works");

  await page.getByRole("button", { name: "打开功能菜单" }).click();
  await expect(page.getByRole("button", { name: "浅色" })).toBeVisible();
  await page.getByRole("button", { name: "浅色" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "搜索站内内容 ⌘ K" }).click();
  const searchbox = page.getByRole("searchbox", { name: "ESC" });
  await searchbox.fill("LunaCore");
  await expect(page.locator('[data-search-results] [data-search-result-index="0"]')).toBeVisible();
});

test("homepage hero keeps a real four-depth scroll relationship", async ({ page }) => {
  await page.goto("/");
  const layers = page.locator("[data-parallax-hero] .scene-stack--light [data-parallax-layer]");
  await expect(layers).toHaveCount(4);
  await expect(layers.nth(0)).toHaveAttribute("data-depth", "8");
  await expect(layers.nth(1)).toHaveAttribute("data-depth", "5");
  await expect(layers.nth(2)).toHaveAttribute("data-depth", "2");
  await expect(layers.nth(3)).toHaveAttribute("data-depth", "1");
  const layerSources = await layers.evaluateAll((items) => items.map((item) => getComputedStyle(item).backgroundImage));
  expect(layerSources).toEqual([
    expect.stringContaining("/assets/scenes/light/sky.webp"),
    expect.stringContaining("/assets/scenes/light/distance.webp"),
    expect.stringContaining("/assets/scenes/light/settlement.webp"),
    expect.stringContaining("/assets/scenes/light/foreground.webp"),
  ]);
  expect(await page.locator("[data-parallax-hero] .home-hero__viewport").evaluate((element) => getComputedStyle(element).position)).toBe("sticky");

  const before = await layers.evaluateAll((items) => items.map((item) => getComputedStyle(item).transform));
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(80);
  const after = await layers.evaluateAll((items) => items.map((item) => getComputedStyle(item).transform));

  expect(after).not.toEqual(before);
  const yOffsets = after.map((transform) => {
    const values = transform.match(/matrix3d\(([^)]+)\)/)?.[1].split(",").map(Number);
    return values?.[13] ?? Number(transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,([^\)]+)/)?.[1] ?? "0");
  });
  expect(yOffsets[0]).toBeGreaterThan(yOffsets[1]);
  expect(yOffsets[1]).toBeGreaterThan(yOffsets[2]);
  expect(yOffsets[2]).toBeGreaterThan(yOffsets[3]);
});

test("works and both language routes render", async ({ page }) => {
  await page.goto("/works");
  await expect(page.getByRole("heading", { name: "作品", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /LunaCore/ })).toHaveAttribute("href", "/works/luna-core");

  await page.goto("/works?category=core");
  await expect(page.locator("[data-result-count]")).toHaveText("1 件作品");

  await page.goto("/en/works/luna-core");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Give complex foundations a clear core.", level: 1 })).toBeVisible();
});

test("full search restores the query from the URL", async ({ page }) => {
  await page.goto("/search?q=LunaCore");
  await expect(page.locator('input[name="q"]')).toHaveValue("LunaCore");
  await expect(page.locator("[data-full-search-results] .full-search-result")).toHaveCount(3);
  await page.locator('[data-full-scope="works"]').click();
  await expect(page.locator("[data-full-search-results] .full-search-result")).toHaveCount(1);
  await page.locator('[data-full-scope="docs"]').click();
  await expect(page.locator("[data-full-search-results] .full-search-result")).toHaveCount(2);
});

test("default work pages switch between available sections", async ({ page }) => {
  await page.goto("/works/dominion");
  await page.getByRole("tab", { name: "图库", exact: true }).click();
  await expect(page.locator('[data-work-panel="gallery"]')).toBeVisible();
  await page.getByRole("tab", { name: "获取方式", exact: true }).click();
  await expect(page.locator('[data-work-panel="acquisition"]')).toBeVisible();
  await expect(page.locator('[data-work-panel="intro"]')).toBeHidden();
});

test("homepage keeps a stable navigation fallback without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LunaDeerMC", level: 1 })).toBeVisible();
  await expect(page.locator("[data-featured-item]")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "浏览作品" })).toHaveAttribute("href", "/works");
  await context.close();
});

test("documentation keeps navigation inside the current document set", async ({ page }) => {
  await page.goto("/docs/cores/luna-core");
  await expect(page.getByRole("heading", { name: "LunaCore", level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "文档集导航" }).getByRole("link", { name: "安装与启动", exact: true })).toHaveAttribute("href", "/docs/cores/luna-core/setup");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "文档目录" }).click();
  await expect(page.locator("[data-docs-reader]")).toHaveClass(/is-sidebar-open/);
  await page.locator("[data-close-doc-drawers]").click();
  await page.getByRole("button", { name: "本页目录" }).click();
  await expect(page.locator("[data-docs-reader]")).toHaveClass(/is-toc-open/);
});
