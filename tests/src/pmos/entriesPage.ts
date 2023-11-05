import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class EntriesPage extends BasePage {
  async expectItem(index: number, title: string, content: string) {
    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(title),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(content),
    ).toBeVisible();
  }
}
