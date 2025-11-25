import { expect, Page } from "@playwright/test";

export class AddQuickScrapPage {
  constructor(private page: Page) {}

  async selectJournal(name: string) {
    await this.page.getByLabel("Add to journal").click();
    await this.page.getByRole("option", { name: name }).click();
  }

  async typeTitle(name: string) {
    await this.page.getByTestId("placeholder-Title").click();
    await this.page.getByTestId("placeholder-Title").fill(name);
  }

  async typeContent(content: string) {
    await this.page.locator(".tiptap").nth(1).fill(content);
  }

  async clickSave(): Promise<string> {
    await this.page.getByRole("button", { name: "Save" }).click();

    const appBar = this.page.getByTestId("app-alert-bar");
    await expect(appBar).toContainText("Added entry");

    return appBar.getAttribute("data-related-entity-id");
  }
}
