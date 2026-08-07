import { expect, test } from "@playwright/test";

test("navigation shows the matching skeleton before the real page arrives", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route(/(^|\/)about\/?$/, async (route) => {
    await gate;
    await route.continue();
  });

  await page.goto("/");
  await page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "关于", exact: true }).click();

  await expect(page.locator("[data-route-loading]")).toBeVisible();
  await expect(page.locator("[data-route-loading] [data-skeleton-type='about']")).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute("aria-busy", "true");

  release();

  await expect(page.getByRole("heading", { name: "关于", level: 1 })).toBeVisible();
  await expect(page.locator("[data-route-loading]")).toBeHidden();
});

test("fast navigation does not leave the skeleton visible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "关于", exact: true }).click();

  await expect(page.getByRole("heading", { name: "关于", level: 1 })).toBeVisible();
  await expect(page.locator("[data-route-loading]")).toBeHidden();
});
