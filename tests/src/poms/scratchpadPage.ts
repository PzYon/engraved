import { expect, Page } from "@playwright/test";

export class ScratchpadPage {
  constructor(private page: Page) {}

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

  async doubleClickContent(content: string) {
    await this.page.getByText(content, { exact: true }).dblclick();
  }

  async expectEditMode(isEditMode: boolean) {
    await expect(this.page.locator(".tiptap")).toHaveCount(isEditMode ? 1 : 0);
  }

  async expectContent(content: string) {
    await expect(this.page.getByText(content, { exact: true })).toBeVisible();
  }
}
