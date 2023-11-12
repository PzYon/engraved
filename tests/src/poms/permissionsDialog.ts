import { Page } from "@playwright/test";

export class PermissionsDialog {
  constructor(private page: Page) {}

  async addUserWithWritePermissions(email: string) {
    await this.typeEmail(email);
    await this.selectWritePermissions();

    await this.page.getByLabel("Add", { exact: true }).click();
  }

  async savePermissionsAndCloseDialog() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.getByText("Modified journal permissions").click();

    await this.page.getByRole("button", { name: "Cancel" }).click();
  }

  private async typeEmail(value: string) {
    await this.page.getByLabel("Mail Address").click();
    await this.page.getByLabel("Mail Address").fill(value);
  }

  private async selectWritePermissions() {
    await this.page.getByLabel("Read").click();
    await this.page.getByRole("option", { name: "Write" }).click();
  }
}
