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

  async expectToShowJournal(journalId: string) {
    return await this.page
      .getByTestId("page")
      .getByTestId(journalId)
      .isVisible();
  }

  async expectNotToShowJournal(id: string) {
    return !(await this.expectToShowJournal(id));
  }

  async navigateToJournalPage(journalName: string) {
    await this.page.getByRole("link", { name: journalName }).click();

    // this could also be a ScrapJournalPage, but for the moment
    // a MetricJournalPage is enough.
    return new MetricJournalPage(this.page);
  }
}
