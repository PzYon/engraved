import { BasePage } from "./basePage";
import { JournalEditPage } from "./journalEditPage";
import { PermissionsDialog } from "./permissionsDialog";

export abstract class JournalPage extends BasePage {
  async getJournalId() {
    return await this.page
      .getByTestId("journal")
      .getAttribute("data-journal-id");
  }

  async clickPermissionsAction() {
    await this.clickPageAction("Permissions");
    return new PermissionsDialog(this.page);
  }

  async navigateToEditPage(): Promise<JournalEditPage> {
    await this.clickPageAction("Edit");
    return new JournalEditPage(this.page);
  }
}
