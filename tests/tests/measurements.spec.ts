import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { getStartUrl } from "../src/constants";

let counter = 1;

test.beforeEach(async ({ page }) => {
  await page.goto(getStartUrl("measurements", (counter++).toString()));
});

const value1 = "23";
const value2 = "19.5";

test("add new value journal, add some entries", async ({ page }) => {
  const journalPage = await addNewJournal(page, "Value", "Journal with values");

  await journalPage.addValue(value1);
  await journalPage.addValue(value2);

  await journalPage.validateNumberOfTableRows(2);

  await journalPage.expectTableCellToHaveValue(value1);
  await journalPage.expectTableCellToHaveValue(value2);
});
