import { expect, Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async validatePageTitle(expected: string) {
    await expect(this.page).toHaveTitle(expected + " | engraved.");
  }

  async clickPageAction(name: string) {
    await this.page
      .getByTestId("page-actions")
      .getByRole("button", { name: name })
      .click();
  }

  async clickRefreshData() {
    await this.page.getByRole("button", { name: "Refresh data" }).click();
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
  }
}
