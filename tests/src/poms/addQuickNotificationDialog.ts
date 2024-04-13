import { expect, Page } from "@playwright/test";

export class AddQuickNotificationDialog {
  constructor(private page: Page) {}

  async selectJournal(name: string) {
    await this.page.getByLabel("Add to journal").click();
    await this.page.getByRole("option", { name: name }).click();
  }

  async type(text: string) {
    await this.page.getByPlaceholder("What and when?").type(text);
  }

  async clickSave(): Promise<string> {
    await this.page.getByRole("button", { name: "Save" }).click();

    const appBar = this.page.getByTestId("app-alert-bar");

    await expect(appBar.getByText("Added entry")).toBeVisible();

    return await appBar.getAttribute("data-related-entity-id");
  }
}
