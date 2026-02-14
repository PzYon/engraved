import { BasePage } from "./basePage";
import { expect } from "@playwright/test";

export abstract class OverviewPage extends BasePage {
  async expectToShowNEntities(number: number) {
    await expect(
      this.page.locator("ul.overview-list > li.overview-list-item"),
    ).toHaveCount(number);
  }
}
