import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { MetricJournalPage } from "../src/poms/metricJournalPage";

const value1 = "23";
const value2 = "19.5";

test("add new value journal, add some entries, delete entry", async ({
  page,
}) => {
  await login(page, "entries", "Value", "Journal with values");

  const journalPage = new MetricJournalPage(page);

  await journalPage.addValue(value1);
  await journalPage.addValue(value2);

  await journalPage.validateNumberOfTableRows(3);
  await journalPage.expectTableCellToHaveValue(value1);
  await journalPage.expectTableCellToHaveValue(value2);

  const deleteEntryAction = await journalPage.navigateToDeleteEntryAction(2);
  await deleteEntryAction.clickFirstDeleteButton();

  await journalPage.validateNumberOfTableRows(2);
});
