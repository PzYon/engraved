import { expect, Page } from "@playwright/test";

export class ScratchpadPage {
  constructor(private page: Page) {}

  private get editor() {
    return this.page.getByTestId("placeholder-Jot something down");
  }

  async typeContent(content: string) {
    await this.editor.click();
    await this.editor.pressSequentially(content);
  }

  async expectContent(content: string) {
    await expect(this.editor).toHaveText(content);
  }

  async expectSaved() {
    await expect(this.page.getByTestId("scratchpad-status")).toHaveText(
      "Saved",
    );
  }
}
