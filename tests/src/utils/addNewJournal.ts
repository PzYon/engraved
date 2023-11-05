import { Page } from "@playwright/test";
import { AddJournalPage } from "../pmos/addJournalPage";
import { MetricJournalPage } from "../pmos/metricJournalPage";

export async function addNewJournal(
  page: Page,
  type: "Value" | "Scraps",
  name: string,
  description: string = "",
): Promise<MetricJournalPage> {
  await page.getByRole("link", { name: "Add journal" }).click();

  const addJournalPage = new AddJournalPage(page);
  await addJournalPage.selectType(type);
  await addJournalPage.typeName(name);
  await addJournalPage.typeDescription(description);

  return await addJournalPage.clickSave();
}
