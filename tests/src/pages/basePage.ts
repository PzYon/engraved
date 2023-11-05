import { expect, Page } from "@playwright/test";
import { JournalsPage } from "./journalsPage";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async validatePageTitle(exepcted: string) {
    await expect(this.page).toHaveTitle(exepcted + " | engraved.");
  }

  async navigateToHome() {
    await this.page.getByRole("link", { name: "engraved." }).click();

    await expect(this.page.getByRole("tab", { name: "Entries" })).toBeVisible();
    await expect(
      this.page.getByRole("tab", { name: "Journals" }),
    ).toBeVisible();

    return new JournalsPage(this.page);
  }
}
