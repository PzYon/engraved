import { expect, test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import {
  navigateToEntriesPage,
  navigateToHome,
  navigateToScheduledPage,
} from "../src/utils/navigateTo";

test.beforeEach(async ({ page }) => {
  await login(page, "schedule");
});

test("add schedule to entry and mark as done", async ({ page }) => {
  const journalPage = await addNewJournal(page, "Scraps", "My Journal");

  const quickNotificationDialog = await journalPage.clickAddQuickNotification();

  await quickNotificationDialog.selectJournal("My Journal");
  await quickNotificationDialog.type("Do Stuff tom at 17:30");
  const entityId = await quickNotificationDialog.clickSave();

  await navigateToHome(page);
  let scheduledPage = await navigateToScheduledPage(page);

  const entity = scheduledPage.getEntityElement(entityId);
  await expect(entity).toBeVisible();

  await entity.getByRole("button", { name: "Mark as done" }).click();

  await page.getByRole("button", { name: "Mark entry as done" }).click();

  await navigateToHome(page);
  scheduledPage = await navigateToScheduledPage(page);

  await scheduledPage.expectNotToShowEntity(entityId);

  const entriesPage = await navigateToEntriesPage(page);
  await entriesPage.expectToShowEntity(entityId);
});
