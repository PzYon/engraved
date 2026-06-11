import { test } from "../src/fixtures";
import { MetricJournalPage } from "../src/poms/metricJournalPage";
import { TimerJournalPage } from "../src/poms/timerJournalPage";

const value1 = "23";
const value2 = "19.5";

test("delete an entry from a value journal", async ({ page, testData }) => {
  const { journals } = await testData.seed({
    journals: [
      {
        name: "Journal with values",
        type: "Gauge",
        entries: [{ value: Number(value1) }, { value: Number(value2) }],
      },
    ],
  });

  await page.goto(`/journals/details/${journals[0].journalId}`);

  const journalPage = new MetricJournalPage(page);

  await journalPage.validateNumberOfTableRows(3);
  await journalPage.expectTableCellToHaveValue(value1);
  await journalPage.expectTableCellToHaveValue(value2);

  const deleteEntryAction = await journalPage.navigateToDeleteEntryAction(2);
  await deleteEntryAction.clickFirstDeleteButton();

  await journalPage.validateNumberOfTableRows(2);
});

test("add a value to a value journal via the UI", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "Journal with values", type: "Gauge" }],
  });

  await page.goto(`/journals/details/${journals[0].journalId}`);

  const journalPage = new MetricJournalPage(page);

  await journalPage.addValue(value1);

  await journalPage.expectTableCellToHaveValue(value1);
});

test("start and stop a timer, edit entry", async ({ page, testData }) => {
  const { journals } = await testData.seed({
    journals: [{ name: "Journal with timer", type: "Timer" }],
  });

  await page.goto(`/journals/details/${journals[0].journalId}`);

  const journalPage = new TimerJournalPage(page);

  await journalPage.startEntry();
  await journalPage.stopEntry();
  await journalPage.validateNumberOfTableRows(1);

  await journalPage.resetEndDateToNow(0);
  await journalPage.validateNumberOfTableRows(1);
});

test("show a negative duration when the start date is in the future", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "Journal with timer", type: "Timer" }],
  });

  await page.goto(`/journals/details/${journals[0].journalId}`);

  const journalPage = new TimerJournalPage(page);

  await journalPage.openAddEntryFullForm();
  await journalPage.moveStartDateFiveMinutesIntoFuture();

  // start is ~5min in the future, so the duration must be a small negative
  // value (e.g. -00:04:59), not the timezone-offset bug that showed -01:55:00
  await journalPage.expectDurationToMatch(/^-00:0[45]:\d\d$/);
});
