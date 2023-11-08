import { expect, Page } from "@playwright/test";

export class DeleteDialog {
  constructor(private page: Page) {}

  async clickFirstDeleteButton() {
    await this.page.getByRole("button", { name: "Yes, delete!" }).click();
  }

  async typeInConfirmationTextBox(text: string) {
    await this.page.getByRole("textbox").click();
    await this.page.getByRole("textbox").fill(text);
  }

  async clickSecondDeleteButton() {
    await this.page.getByRole("button", { name: "Yes, delete!" }).click();
    await expect(
      this.page.getByText("Successfully deleted journal."),
    ).toBeVisible();
  }
}
