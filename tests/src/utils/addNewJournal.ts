import { Page } from "@playwright/test";
import { AddJournalPage } from "../poms/addJournalPage";
import { MetricJournalPage } from "../poms/metricJournalPage";

export async function addNewJournal(
  page: Page,
  type: "Value" | "Timer" | "Scraps",
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
