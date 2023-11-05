import { expect, Page } from "@playwright/test";

export class ScrapListComponent {
  constructor(private page: Page) {}

  async typeTitle(title: string) {
    await this.page.getByPlaceholder("Title").click();
    await this.page.getByPlaceholder("Title").fill(title);
  }

  async addListItem(value: string) {
    await this.page.getByLabel("Add new").click();
    await this.page
      .getByRole("listitem")
      .getByRole("textbox")
      .last()
      .fill(value);
  }

  async clickSave(isUpdate?: boolean) {
    await this.page.getByRole("button", { name: "Save" }).click();

    await expect(
      this.page.getByText(isUpdate ? "Updated entry" : "Added entry"),
    ).toBeVisible();
  }
}
