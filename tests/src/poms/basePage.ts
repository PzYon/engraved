import { expect, Page } from "@playwright/test";
import { clickPageAction } from "../utils/clickPageAction";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async validatePageTitle(expected: string) {
    await expect(this.page).toHaveTitle(expected + " | engraved.");
  }

  async clickPageAction(name: string) {
    await clickPageAction(this.page, name);
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
  }
}
