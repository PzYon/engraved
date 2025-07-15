import { expect, Page } from "@playwright/test";

export class GoToPage {
  constructor(private page: Page) {}

  async addJournal(name: string) {
    await this.page.getByRole("link", { name: "Add journal" }).click();
    await this.page.getByRole("textbox", { name: "Name" }).fill(name);
    await this.page.getByRole("button", { name: "Create" }).click();
  }

  async expectNumberOfItems(expected: number) {
    await expect(this.page.getByRole("listitem")).toHaveCount(expected);
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
