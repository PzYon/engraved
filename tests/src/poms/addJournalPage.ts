import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { MetricJournalPage } from "./metricJournalPage";

export class AddJournalPage extends BasePage {
  async selectType(typeLabel: "Value" | "Timer" | "Scraps") {
    if (typeLabel === "Scraps") {
      return;
    }

    await this.page.getByLabel("Journal Type").click();
    await this.page.getByText(typeLabel).click();
  }

  async typeName(name: string) {
    await this.page.getByLabel("Name").fill(name);
  }

  async typeDescription(description: string) {
    await this.page.getByLabel("Description").fill(description);
  }

  async clickSave() {
    await this.page.getByRole("button", { name: "Create" }).click();
    await this.page.waitForURL(/journals\/(?!create)/);

    // wait until the page is fully loaded
    await expect(this.page.getByTestId("refresh-data")).toContainClass("ready");
    await expect(this.page.getByTestId("empty-placeholder")).toBeVisible();

    return new MetricJournalPage(this.page);
  }
}
