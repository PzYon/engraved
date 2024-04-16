import { expect, Page } from "@playwright/test";
import { clickPageAction } from "../utils/clickPageAction";
import { AddQuickNotificationDialog } from "./addQuickNotificationDialog";

export abstract class BasePage {
  constructor(protected page: Page) {}

  getEntityElement(entityId: string) {
    return this.page.getByTestId("page").getByTestId(entityId);
  }

  async validatePageTitle(expected: string) {
    await expect(this.page).toHaveTitle(expected + " | engraved.");
  }

  async clickPageAction(name: string) {
    await clickPageAction(this.page, name);
  }

  async clickRefreshData() {
    await this.page.getByRole("button", { name: "Refresh data" }).click();
  }

  async clickAddQuickNotification() {
    await this.page.getByRole("button", { name: "Add notification" }).click();

    return new AddQuickNotificationDialog(this.page);
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
  }
}
