import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { MetricJournalPage } from "../src/poms/metricJournalPage";
import { TimerJournalPage } from "../src/poms/timerJournalPage";

const value1 = "23";
const value2 = "19.5";

test("add new value journal, add some entries, delete entry", async ({
  page,
}) => {
  await login(page, "entries", "Gauge", "Journal with values");

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

test("add new timer journal, start and stop a timer, edit entry", async ({
  page,
}) => {
  await login(page, "entries", "Timer", "Journal with timer");

  const journalPage = new TimerJournalPage(page);

  // start a new timer entry
  await journalPage.startEntry();

  // stop the running timer entry (sets the end date)
  await journalPage.stopEntry();

  await journalPage.validateNumberOfTableRows(1);

  // edit the single entry and set its end date
  await journalPage.editEntryEndDate(0);

  await journalPage.validateNumberOfTableRows(1);
});
