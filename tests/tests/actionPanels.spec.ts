import { expect, Page } from "@playwright/test";
import { test } from "../src/fixtures";
import { isAndroidTest } from "../src/utils/isAndroidTest";

// These tests verify viewport-agnostic navigation logic via the overview list
// item actions, which are collapsed behind a focus interaction on the mobile
// (android) layout. The behaviour under test is fully covered by the desktop run.
const skipReason =
  "overview list actions are collapsed on mobile; covered by the desktop run";

function overviewItem(page: Page, name: string) {
  return page
    .locator('[data-testid^="journals-list-item-"]')
    .filter({ hasText: name });
}

test.describe("action panels", () => {
  // describe-level skip so android bails out before the (auto) login fixture runs
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(({ viewport }) => isAndroidTest(viewport), skipReason);

  test("switching between actions on the same item does not navigate via root", async ({
    page,
    testData,
  }) => {
    await testData.seed({
      journals: [{ name: "Switch Journal", type: "Gauge" }],
    });
    await page.goto("/");

    const item = overviewItem(page, "Switch Journal");

    await item.getByLabel("Edit schedule", { exact: true }).click();
    await expect(page).toHaveURL(/action-key=schedule/);

    // record every client-side navigation (history pushState/replaceState) that
    // happens while switching actions. Playwright's "framenavigated" only fires on
    // full document loads, so we hook the history API to see SPA navigations.
    await page.evaluate(() => {
      const w = window as unknown as { __urls: string[] };
      w.__urls = [];
      const record = () => w.__urls.push(location.pathname + location.search);
      for (const name of ["pushState", "replaceState"] as const) {
        const original = history[name].bind(history);
        history[name] = (...args: Parameters<History["pushState"]>) => {
          original(...args);
          record();
        };
      }
    });

    await item.getByLabel("Permissions", { exact: true }).click();
    await expect(page).toHaveURL(/action-key=permissions/);

    // the transition must actually navigate, but go straight to the new action,
    // never via "/" (root)
    const urls = await page.evaluate(
      () => (window as unknown as { __urls: string[] }).__urls,
    );
    expect(urls.length).toBeGreaterThan(0);
    expect(urls).not.toContain("/");
  });

  test("opening an add-entry panel on one journal then another keeps the second open", async ({
    page,
    testData,
  }) => {
    await testData.seed({
      journals: [
        { name: "Journal A", type: "Gauge" },
        { name: "Journal B", type: "Gauge" },
      ],
    });
    await page.goto("/");

    await overviewItem(page, "Journal A")
      .getByLabel("Add entry", { exact: true })
      .click();
    await expect(page).toHaveURL(/selected-item=/);

    const itemB = overviewItem(page, "Journal B");
    await itemB.getByLabel("Add entry", { exact: true }).click();

    // the second journal's panel must stay open (params not wiped)
    await expect(page).toHaveURL(/action-key=add-entry/);
    await expect(
      itemB.getByRole("button", { name: "Add entry" }),
    ).toBeVisible();
  });
});
