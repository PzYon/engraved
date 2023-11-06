import { MetricJournalPage } from "./metricJournalPage";
import { BasePage } from "./basePage";

export class JournalEditPage extends BasePage {
  async setName(name: string) {
    await this.page.getByLabel("Name").click();
    await this.page.getByLabel("Name").fill(name);
  }

  async clickSave() {
    await this.page.getByText("Save").click();
    return new MetricJournalPage(this.page);
  }
}
