import { expect, test } from "@playwright/test";

test("docs reader swaps same-set pages via content chunks without a full page request", async ({ page }) => {
  let fullDocumentRequest = false;
  page.on("request", (request) => {
    if (request.resourceType() === "document" && request.url().includes("/docs/cores/deerfolia/installation")) {
      fullDocumentRequest = true;
    }
  });

  await page.goto("/docs/cores/deerfolia");
  await page
    .getByRole("navigation", { name: "文档集导航" })
    .getByRole("link", { name: "安装与首次启动", exact: true })
    .click();

  await expect(page).toHaveURL(/\/docs\/cores\/deerfolia\/installation$/);
  await expect(page.getByRole("heading", { name: /安装与首次启动/ })).toBeVisible();
  await expect(page.locator('[data-docs-sidebar] a[aria-current="page"]')).toHaveAttribute(
    "href",
    "/docs/cores/deerfolia/installation",
  );
  expect(fullDocumentRequest).toBe(false);
});

test("docs reader shows the skeleton while a chunk is still loading", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route("**/_docs-chunks/docs/cores/deerfolia/installation.json", async (route) => {
    await gate;
    await route.continue();
  });

  await page.goto("/docs/cores/deerfolia");
  await page
    .getByRole("navigation", { name: "文档集导航" })
    .getByRole("link", { name: "安装与首次启动", exact: true })
    .click();

  await expect(page.locator("[data-route-loading]")).toBeVisible();
  await expect(page.locator("[data-route-loading] [data-skeleton-type='docs-article']")).toBeVisible();

  release();

  await expect(page.getByRole("heading", { name: /安装与首次启动/ })).toBeVisible();
  await expect(page.locator("[data-route-loading]")).toBeHidden();
});

test("docs reader silently prefetches the rest of the doc set after load", async ({ page }) => {
  const chunkRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/_docs-chunks/docs/cores/deerfolia/")) chunkRequests.push(request.url());
  });

  await page.goto("/docs/cores/deerfolia");

  await expect
    .poll(() => chunkRequests.length, { timeout: 5000 })
    .toBeGreaterThanOrEqual(6);
});

test("browser back and forward stay inside the docs reader", async ({ page }) => {
  await page.goto("/docs/cores/deerfolia");
  await page
    .getByRole("navigation", { name: "文档集导航" })
    .getByRole("link", { name: "安装与首次启动", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: /安装与首次启动/ })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/docs\/cores\/deerfolia$/);
  await expect(page.getByRole("heading", { name: "DeerFolia", exact: true })).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL(/\/docs\/cores\/deerfolia\/installation$/);
  await expect(page.getByRole("heading", { name: /安装与首次启动/ })).toBeVisible();
});

test("deep document links remain static without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/docs/cores/deerfolia/installation");
  await expect(page.getByRole("heading", { name: /安装与首次启动/ })).toBeVisible();
  await context.close();
});

test("links leaving the current doc set keep using the normal page flow", async ({ page }) => {
  await page.goto("/docs/cores/deerfolia");
  await page.locator(".docs-breadcrumb a").first().click();
  await expect(page).toHaveURL(/\/docs\/?$/);
  await expect(page.getByRole("heading", { name: "文档", level: 1 })).toBeVisible();
});
