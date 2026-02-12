import { expect, test } from "@playwright/test";
import { login } from "../src/utils/login";
import {
  navigateToEntriesPage,
  navigateToHome,
  navigateToScheduledPage,
} from "../src/utils/navigateTo";
import { isAndroidTest } from "../src/utils/isAndroidTest";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

test("add schedule to entry and mark as done", async ({ page }) => {
  await login(page, "schedule", "Scraps", "My Journal");

  const journalPage = new ScrapsJournalPage(page);

  const quickNotificationDialog = await journalPage.clickAddQuickScrapAction();

  await quickNotificationDialog.selectJournal("My Journal");
  await quickNotificationDialog.typeTitle("Do Stuff tom at 17:30");
  const entityId = await quickNotificationDialog.clickSave();

  await navigateToHome(page);
  let scheduledPage = await navigateToScheduledPage(page);

  const entity = scheduledPage.getEntityElement(entityId);
  await expect(entity).toBeVisible();

  /* eslint-disable playwright/no-conditional-in-test */
  if (isAndroidTest()) {
    await entity.click();
  }

  await entity.getByRole("link", { name: "Edit schedule" }).click();

  await page.getByRole("button", { name: "Mark entry as done" }).click();

  await navigateToHome(page);
  scheduledPage = await navigateToScheduledPage(page);

  await scheduledPage.expectNotToShowEntity(entityId);

  const entriesPage = await navigateToEntriesPage(page);
  await entriesPage.expectToShowEntity(entityId);
});
