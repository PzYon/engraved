import { expect, Page } from "@playwright/test";

export class GoToPage {
  constructor(private page: Page) {}

  async expectNumberOfItems(expected: number) {
    await expect(this.page.getByRole("listitem")).toHaveCount(expected, {
      timeout: 1000,
    });
  }

  async expectItemText(index: number, expectedText: string) {
    await expect(this.getItemByIndex(index)).toHaveText(expectedText);
  }

  async clickItem(index: number) {
    await this.getItemByIndex(index).click();
  }

  private getItemByIndex(index: number) {
    return this.page.getByRole("listitem").nth(index);
  }

  async typeText(text: string) {
    await this.page.getByRole("textbox", { name: "Go to" }).fill(text);
  }

  async arrowDown() {
    await this.pressKey("ArrowDown");
  }

  async arrowUp() {
    await this.pressKey("ArrowUp");
  }

  async selectCurrent() {
    await this.pressKey("Enter");
  }

  private async pressKey(key: string) {
    await this.getFocusedElement().press(key);
  }

  private getFocusedElement() {
    return this.page.locator(`:focus`);
  }
}
