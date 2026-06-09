import { test } from "../src/fixtures";
import { MetricJournalPage } from "../src/poms/metricJournalPage";

test("verify chart is displayed when toggled", async ({ page, testData }) => {
  const { journals } = await testData.seed({
    journals: [
      {
        name: "Journal for charts",
        type: "Gauge",
        entries: [{ value: 10 }, { value: 20 }],
      },
    ],
  });

  await page.goto(`/journals/details/${journals[0].journalId}`);

  const journalPage = new MetricJournalPage(page);

  await journalPage.toggleChart();

  await journalPage.expectChart();
});
