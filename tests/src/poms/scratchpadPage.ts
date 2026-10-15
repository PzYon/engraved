import { expect, Page } from "@playwright/test";

export class ScratchpadPage {
  constructor(private page: Page) {}

  async typeContent(content: string) {
    const editor = this.page.locator(".tiptap");
    await editor.click();
    await editor.pressSequentially(content);
  }

  async clickSave() {
    await this.waitForSave(async () => {
      await this.page.getByLabel("Save", { exact: true }).click();
    });
  }

  async doubleClickContent(content: string) {
    await this.page.getByText(content, { exact: true }).dblclick();
  }

  async expectEmptyEditor() {
    await expect(this.page.locator(".tiptap")).toHaveText("");
  }

  async expectEditMode(isEditMode: boolean) {
    await expect(this.page.locator(".tiptap")).toHaveCount(isEditMode ? 1 : 0);
  }

  async deleteContent() {
    await this.waitForSave(async () => {
      await this.page.getByLabel("Delete", { exact: true }).click();
      await this.page.getByRole("button", { name: "Yes, delete!" }).click();
    });
  }

  async expectContent(content: string) {
    await expect(this.page.getByText(content, { exact: true })).toBeVisible();
  }

  private async waitForSave(action: () => Promise<void>) {
    const saved = this.page.waitForResponse(
      (response) =>
        response.url().endsWith("/user/scratchpad") &&
        response.request().method() === "PUT",
    );

    await action();

    await saved;
  }
}
