import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class SearchPage extends BasePage {
  async search(text: string) {
    const searchInput = this.page.getByRole("textbox", { name: "Search" });
    await searchInput.fill(text);
    await searchInput.press("Enter");
  }

  async clearSearch() {
    await this.page.getByRole("button", { name: "Clear search" }).click();
  }

  async expectResultNotVisible(title: string) {
    await expect(this.page.getByText(title).first()).toBeHidden();
  }

  async expectNoResults() {
    await expect(this.page.getByText(/Nothing found/)).toBeVisible();
  }
}
