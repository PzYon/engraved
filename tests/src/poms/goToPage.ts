import { Page } from "@playwright/test";

export class GoToPage {
  constructor(private page: Page) {}

  async addJournal(name: string) {
    await this.page.getByRole("link", { name: "Add journal" }).click();
    await this.page.getByRole("textbox", { name: "Name" }).fill(name);
    await this.page.getByRole("button", { name: "Create" }).click();
  }

  async typeText(text: string) {
    await this.page.getByRole("textbox", { name: "Go to" }).fill(text);
  }

  async arrowDown() {
    await this.getFocusedElement().press("ArrowDown");
  }

  async arrowUp() {
    await this.getFocusedElement().press("ArrowUp");
  }

  async selectCurrent() {
    await this.getFocusedElement().press("Enter");
  }

  private getFocusedElement() {
    return this.page.locator(`:focus`);
  }
}
