import { expect, Page } from "@playwright/test";

export class ScratchpadPage {
  constructor(private page: Page) {}

  async clickEdit() {
    await this.page.getByLabel("Edit scrap", { exact: true }).click();
  }

  async typeContent(content: string) {
    const editor = this.page.locator(".tiptap");
    await editor.click();
    await editor.pressSequentially(content);
  }

  async clickSave() {
    const saved = this.page.waitForResponse(
      (response) =>
        response.url().endsWith("/user/scratchpad") &&
        response.request().method() === "PUT",
    );

    await this.page.getByLabel("Save", { exact: true }).click();

    await saved;
  }

  async expectContent(content: string) {
    await expect(this.page.getByText(content, { exact: true })).toBeVisible();
  }
}
