import { expect, Page, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { navigateToHome } from "../src/utils/navigateTo";
import { createJournalViaApi } from "../src/utils/apiClient";

function overviewItem(page: Page, name: string) {
  return page
    .locator('[data-testid^="journals-list-item-"]')
    .filter({ hasText: name });
}

test("switching between actions on the same item does not navigate via root", async ({
  page,
}) => {
  await login(page, "action-switch", "Gauge", "Switch Journal");
  await navigateToHome(page);
  const item = overviewItem(page, "Switch Journal");

  await item.getByLabel("Edit schedule", { exact: true }).click();
  await expect(page).toHaveURL(/action-key=schedule/);

  // capture every URL the main frame navigates to during the transition
  const urls: string[] = [];
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) {
      const u = new URL(f.url());
      urls.push(u.pathname + u.search);
    }
  });

  await item.getByLabel("Permissions", { exact: true }).click();
  await expect(page).toHaveURL(/action-key=permissions/);

  // the transition must go straight to the new action, never via "/" (root)
  expect(urls).not.toContain("/");
});

test("opening an add-entry panel on one journal then another keeps the second open", async ({
  page,
  request,
}) => {
  const userName = await login(page, "two-journal", "Gauge", "Journal A");
  await navigateToHome(page);
  await createJournalViaApi(request, userName, {
    name: "Journal B",
    journalType: "Gauge",
  });
  await page.reload();

  await overviewItem(page, "Journal A")
    .getByLabel("Add entry", { exact: true })
    .click();
  await expect(page).toHaveURL(/selected-item=/);

  const itemB = overviewItem(page, "Journal B");
  await itemB.getByLabel("Add entry", { exact: true }).click();

  // the second journal's panel must stay open (params not wiped)
  await expect(page).toHaveURL(/action-key=add-entry/);
  await expect(itemB.getByRole("button", { name: "Add entry" })).toBeVisible();
});
