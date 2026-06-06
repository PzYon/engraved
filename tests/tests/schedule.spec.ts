import { expect, test } from "@playwright/test";
import { login } from "../src/utils/login";
import {
  navigateToEntriesPage,
  navigateToHome,
  navigateToJournalPage,
  navigateToScheduledPage,
} from "../src/utils/navigateTo";
import { isAndroidTest } from "../src/utils/isAndroidTest";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapMarkdownComponent } from "../src/poms/scrapMarkdownComponent";

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

test("auto-save keeps an existing schedule", async ({ page }) => {
  await login(page, "schedule-autosave", "Scraps", "My Journal");

  const journalPage = new ScrapsJournalPage(page);

  // create a scheduled note (the date in the title sets the schedule)
  const quickAdd = await journalPage.clickAddQuickScrapAction();
  await quickAdd.selectJournal("My Journal");
  await quickAdd.typeTitle("Buy milk tom at 17:30");
  await quickAdd.typeContent("remember");
  const entityId = await quickAdd.clickSave();

  // it shows up on the scheduled page
  await navigateToHome(page);
  let scheduledPage = await navigateToScheduledPage(page);
  await expect(scheduledPage.getEntityElement(entityId)).toBeVisible();

  // edit the note's body and trigger auto-save by clicking outside the scrap
  await navigateToHome(page);
  await navigateToJournalPage(page, "My Journal");

  const note = new ScrapMarkdownComponent(page);
  await note.dblClickToEdit();
  await note.typeAtEnd(" and bread");
  await note.blurToAutoSave(true);

  // the schedule must survive the auto-save: still on the scheduled page
  await navigateToHome(page);
  scheduledPage = await navigateToScheduledPage(page);
  await expect(scheduledPage.getEntityElement(entityId)).toBeVisible();
});

test("editing the title keeps an existing schedule", async ({ page }) => {
  await login(page, "schedule-title-edit", "Scraps", "My Journal");

  const journalPage = new ScrapsJournalPage(page);

  const quickAdd = await journalPage.clickAddQuickScrapAction();
  await quickAdd.selectJournal("My Journal");
  await quickAdd.typeTitle("Buy milk tom at 17:30");
  await quickAdd.typeContent("remember");
  const entityId = await quickAdd.clickSave();

  await navigateToHome(page);
  let scheduledPage = await navigateToScheduledPage(page);
  await expect(scheduledPage.getEntityElement(entityId)).toBeVisible();

  // change the title to a value without a date, then auto-save by clicking out.
  await navigateToHome(page);
  await navigateToJournalPage(page, "My Journal");

  const note = new ScrapMarkdownComponent(page);
  await note.dblClickToEdit();
  await page.getByTestId("placeholder-Title").click();
  await page.getByTestId("placeholder-Title").fill("Buy groceries");
  await note.blurToAutoSave(true);

  // a save never removes a schedule: it is still on the scheduled page.
  await navigateToHome(page);
  scheduledPage = await navigateToScheduledPage(page);
  await expect(scheduledPage.getEntityElement(entityId)).toBeVisible();
});
