import { expect, Page } from "@playwright/test";
import { clickPageAction } from "../utils/clickPageAction";
import { AddQuickScrapPage } from "./addQuickScrapPage";
import { GoToPage } from "./goToPage";
import { JournalsPage } from "./journalsPage";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async clickPageAction(name: string) {
    await clickPageAction(this.page, name);
  }

  async clickRefreshData() {
    await this.page.getByRole("button", { name: "Refresh data" }).click();
  }

  async clickAddQuickScrapAction() {
    await this.page.getByLabel("Quick Add").click();
    return new AddQuickScrapPage(this.page);
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
  }

  async navigateToGoToPage() {
    await this.page.locator("body").press("Alt+.");
    return new GoToPage(this.page);
  }

  async navigateToHome() {
    await this.page.locator("body").press("Alt+h");
    return new JournalsPage(this.page);
  }

  async expectToShowEntity(id: string) {
    const entity = this.getEntityElement(id);
    await expect(entity).toBeVisible();
  }

  async expectNotToShowEntity(id: string) {
    const entity = this.getEntityElement(id);
    await expect(entity).toBeHidden();
  }

  async expectPageTitle(expected: string) {
    await expect(this.page).toHaveTitle(expected + " | engraved.");
  }

  getEntityElement(entityId: string) {
    return this.page.getByTestId("page").getByTestId(entityId);
  }
}
