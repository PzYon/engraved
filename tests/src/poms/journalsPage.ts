import { BasePage } from "./basePage";
import { EntriesPage } from "./entriesPage";
import { AddQuickScrapDialog } from "./addQuickScrapDialog";
import { MetricJournalPage } from "./metricJournalPage";

export class JournalsPage extends BasePage {
  async clickAddQuickScrapAction() {
    await this.page.getByLabel("Add Quick Scrap").click();
    return new AddQuickScrapDialog(this.page);
  }

  async navigateToEntriesPage() {
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

  async navigateToJournalPage(journalId: string) {
    await this.page.getByTestId("page").getByTestId(journalId).click();

    return new MetricJournalPage(this.page);
  }
}
