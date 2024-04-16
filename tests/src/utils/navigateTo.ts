import { expect, Page } from "@playwright/test";
import { EntriesPage } from "../poms/entriesPage";
import { ScheduledPage } from "../poms/scheduledPage";
import { MetricJournalPage } from "../poms/metricJournalPage";

export async function navigateToHome(page: Page) {
  await page.getByRole("link", { name: "engraved." }).click();
  await page.waitForURL((url) => url.pathname === "/");

  await expect(page.getByRole("tab", { name: "Entries" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Journals" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Scheduled" })).toBeVisible();
}

export async function navigateToEntriesPage(page: Page) {
  await page.getByRole("tab", { name: "Entries" }).click();
  return new EntriesPage(page);
}

export async function navigateToScheduledPage(page: Page) {
  await page.getByRole("tab", { name: "Scheduled" }).click();
  return new ScheduledPage(page);
}

export async function navigateToJournalPage(page: Page, journalName: string) {
  await page.getByRole("link", { name: journalName }).click();

  // this could also be a ScrapJournalPage, but for the moment
  // a MetricJournalPage is enough.
  return new MetricJournalPage(page);
}
