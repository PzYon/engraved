import { Page } from "@playwright/test";
import { AddJournalPage } from "../poms/addJournalPage";
import { MetricJournalPage } from "../poms/metricJournalPage";
import { clickPageAction } from "./clickPageAction";

export async function addNewJournal(
  page: Page,
  type: "Value" | "Timer" | "Scraps",
  name: string,
  description: string = "",
): Promise<MetricJournalPage> {
  await clickPageAction(page, "Add journal");

  const addJournalPage = new AddJournalPage(page);
  await addJournalPage.selectType(type);
  await addJournalPage.typeName(name);
  await addJournalPage.typeDescription(description);

  return await addJournalPage.clickSave();
}
