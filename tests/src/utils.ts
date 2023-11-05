import { Page } from "@playwright/test";
import { AddJournalPage } from "./pages/addJournalPage";
import { JournalPage } from "./pages/journalPage";

export async function addNewJournal(
  page: Page,
  type: "Value" | "Scraps",
  name: string,
  description: string = "",
): Promise<JournalPage> {
  await page.getByRole("link", { name: "Add journal" }).click();

  const addJournalPage = new AddJournalPage(page);
  await addJournalPage.selectType(type);
  await addJournalPage.typeName(name);
  await addJournalPage.typeDescription(description);

  return await addJournalPage.clickSave();
}

export async function clickPageAction(page: Page, name: string) {
  await page
    .getByTestId("page-actions")
    .getByRole("button", { name: name })
    .click();
}
