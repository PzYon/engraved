import { BasePage } from "./basePage";
import { EntriesPage } from "./entriesPage";
import { AddQuickScrapDialog } from "./dialogs/addQuickScrapDialog";

export class JournalsPage extends BasePage {
  async clickAddQuickScrap() {
    await this.page.getByLabel("Add Quick Scrap").click();
    return new AddQuickScrapDialog(this.page);
  }

  async navigateToEntries() {
    await this.page.getByRole("tab", { name: "Entries" }).click();
    return new EntriesPage(this.page);
  }
}
