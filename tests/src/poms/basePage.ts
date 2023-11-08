import { expect, Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async validatePageTitle(exepcted: string) {
    await expect(this.page).toHaveTitle(exepcted + " | engraved.");
  }

  async clickPageAction(name: string) {
    await this.page
      .getByTestId("page-actions")
      .getByRole("button", { name: name })
      .click();
  }
}
