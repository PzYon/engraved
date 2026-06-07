import { BasePage } from "./basePage";

export class JournalEditPage extends BasePage {
  async setName(name: string) {
    await this.page.getByLabel("Name").click();
    await this.page.getByLabel("Name").fill(name);
  }

  async clickSave() {
    // imported lazily to avoid a circular module dependency
    // (journalPage -> journalEditPage -> metricJournalPage -> journalPage),
    // which otherwise breaks depending on which spec loads the chain first.
    const { MetricJournalPage } = await import("./metricJournalPage");

    await this.page.getByRole("button", { name: "Save" }).first().click();

    return new MetricJournalPage(this.page);
  }
}
