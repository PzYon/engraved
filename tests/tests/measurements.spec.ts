import { test } from "@playwright/test";
import { addNewJournal } from "../src/addNewJournal";
import { constants } from "../src/constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new value journal, adds entries", async ({ page }) => {
  const journalPage = await addNewJournal(page, "Value", "Journal with values");

  await journalPage.addValue("23");
  await journalPage.addValue("19.5");

  await journalPage.validateNumberOfTableRows(2);

  await journalPage.expectTableCellToHaveValue("23");
  await journalPage.expectTableCellToHaveValue("19.5");
});
