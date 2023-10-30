import { expect, test } from "@playwright/test";
import { addNewJournal } from "./utils";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const journalName = "My First Value Journal";
const renamedJournalName = journalName + " (renamed)";

test("adds new journal, updates journal", async ({ page }) => {
  await addNewJournal(page, journalName, "Value");

  await expect(page).toHaveTitle(journalName + " | engraved.");
  await expect(page.getByText("No entries available.")).toBeVisible();

  await page.getByLabel("Edit").nth(2).click();

  await page.getByLabel("Name").click();
  await page.getByLabel("Name").fill(renamedJournalName);

  await page.getByText("Save").click();

  await expect(page.getByText("No entries available.")).toBeVisible();
  await expect(page).toHaveTitle(renamedJournalName + " | engraved.");
});
