import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage and documentation reader have no serious axe violations", async ({ page }) => {
  await page.goto("/");
  const homeResults = await new AxeBuilder({ page }).analyze();
  expect(homeResults.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""))).toEqual([]);

  await page.goto("/docs/cores/luna-core");
  const docsResults = await new AxeBuilder({ page }).analyze();
  expect(docsResults.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""))).toEqual([]);
});
