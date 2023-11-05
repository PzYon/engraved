import { expect, Page } from "@playwright/test";

export class ScrapListComponent {
  private scrapId: string;

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

    const appBar = await this.page.getByTestId("app-alert-bar");

    await expect(
      appBar.getByText(isUpdate ? "Updated entry" : "Added entry"),
    ).toBeVisible();

    this.scrapId = await appBar.getAttribute("data-related-entity-id");

    return this.scrapId;
  }

  async dblClickToEdit() {
    if (!this.scrapId) {
      throw new Error("Cannot double click on a non-saved entry");
    }

    await this.page.getByTestId("scrap-" + this.scrapId).dblclick();
  }
}
