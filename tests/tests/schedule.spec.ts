import { expect, test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";

test.beforeEach(async ({ page }) => {
  await login(page, "schedule");
});

test("SCHEDULE", async ({ page }) => {
  const journalPage = await addNewJournal(page, "Scraps", "My Journal");

  const quickNotificationDialog = await journalPage.clickAddQuickNotification();

  await quickNotificationDialog.selectJournal("My Journal");
  await quickNotificationDialog.type("Do Stuff tom at 17:30");
  const entityId = await quickNotificationDialog.clickSave();

  const journalsPage = await journalPage.navigateToHome();
  const scheduledPage = await journalsPage.navigateToScheduledPage();

  //await scheduledPage.expectToShowEntity(entityId);

  const entity = scheduledPage.getEntityElement(entityId);

  await expect(entity).toBeVisible();

  const markAsDoneBtn = entity.getByRole("link", { name: "Mark as done" });
  // await expect(markAsDoneBtn).toBeVisible();
  await markAsDoneBtn.click();

  await page.waitForTimeout(5000);

  // todo (maybe continue here or in a new test)
  // - mark as done
  // - delete (via mark as done)
  // - validate "scheduled"-label (maybe color?)
  // - also add a journal with schedule
  // - validate sorting in "Scheduled" view
});
