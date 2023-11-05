import { expect, Page } from "@playwright/test";

export class AddQuickScrapDialog {
  constructor(private page: Page) {}

  async typeName(name: string) {
    await this.page.getByPlaceholder("Title").click();
    await this.page.getByPlaceholder("Title").fill(name);
  }

  async typeContent(content: string) {
    await this.page.getByRole("textbox").nth(1).fill(content);
  }

  async clickSave() {
    await this.page.getByLabel("Save").click();
    await expect(this.page.getByText("Added entry")).toBeVisible();
  }
}
