import { expect, Page } from "@playwright/test";

export class AddQuickScrapDialog {
  constructor(private page: Page) {}

  async selectJournal(name: string) {
    await this.page.getByLabel("Add to journal").click();
    await this.page.getByRole("option", { name: name }).click();
  }

  async typeTitle(name: string) {
    await this.page.getByPlaceholder("Title").click();
    await this.page.getByPlaceholder("Title").fill(name);
  }

  async typeContent(content: string) {
    await this.page.getByRole("textbox").nth(1).fill(content);
  }

  async clickSave(): Promise<string> {
    await this.page.getByRole("button", { name: "Save" }).click();

    const appBar = this.page.getByTestId("app-alert-bar");

    await expect(appBar.getByText("Added entry")).toBeVisible();

    return await appBar.getAttribute("data-related-entity-id");
  }
}
