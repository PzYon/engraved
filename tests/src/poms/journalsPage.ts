import { BasePage } from "./basePage";
import { EntriesPage } from "./entriesPage";
import { AddQuickScrapDialog } from "./addQuickScrapDialog";

export class JournalsPage extends BasePage {
  async clickAddQuickScrap() {
    await this.page.getByLabel("Add Quick Scrap").click();
    return new AddQuickScrapDialog(this.page);
  }

  async navigateToEntries() {
    await this.page.getByRole("tab", { name: "Entries" }).click();
    return new EntriesPage(this.page);
  }

  async expectToShowJournal(id: string) {
    return await this.page
      .getByTestId("page")
      .getByTestId(id)
      .isVisible({ timeout: 1000 });
  }

  async expectNotToShowJournal(id: string) {
    return !(await this.expectToShowJournal(id));
  }
}
