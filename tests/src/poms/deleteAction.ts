import { expect, Page } from "@playwright/test";

export class DeleteAction {
  constructor(
    private page: Page,
    private type: "Journal" | "Entry",
  ) {}

  async clickFirstDeleteButton() {
    await this.clickYesDelete();
  }

  async typeInConfirmationTextBox(text: string) {
    await this.page.getByRole("textbox").click();
    await this.page.getByRole("textbox").fill(text);
  }

  async clickSecondDeleteButton() {
    await this.clickYesDelete();

    if (this.type === "Journal") {
      await this.expectDeletionMessage();
    }
  }

  private async clickYesDelete() {
    await this.page.getByRole("button", { name: "Yes, delete!" }).click();
  }

  private async expectDeletionMessage() {
    await expect(
      this.page.getByText(`Successfully deleted ${this.type.toLowerCase()}.`),
    ).toBeVisible();
  }
}
