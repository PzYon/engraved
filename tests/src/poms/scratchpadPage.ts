import { expect, Page } from "@playwright/test";

export class ScratchpadPage {
  constructor(private page: Page) {}

  private get editor() {
    return this.page.locator(".tiptap");
  }

  async typeContent(content: string) {
    const saved = this.page.waitForResponse(
      (response) =>
        response.url().endsWith("/user/scratchpad") &&
        response.request().method() === "PUT",
    );

    await this.editor.click();
    await this.editor.pressSequentially(content);

    await saved;
  }

  async expectContent(content: string) {
    await expect(this.editor).toHaveText(content);
  }
}
