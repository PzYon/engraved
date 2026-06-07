import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { MetricJournalPage } from "../src/poms/metricJournalPage";

test("verify chart is displayed when toggled", async ({ page }) => {
  await login(page, "charts", "Gauge", "Journal for charts");

  const journalPage = new MetricJournalPage(page);

  await journalPage.addValue("10");
  await journalPage.addValue("20");

  await journalPage.toggleChart();

  await journalPage.expectChart();
});
