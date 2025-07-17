import { expect, Page } from "@playwright/test";

export class ScrapListComponent {
  private scrapId: string;

  constructor(
    private page: Page,
    scrapId?: string,
  ) {
    this.scrapId = scrapId;
  }

  async typeTitle(title: string) {
    await this.page.getByPlaceholder("Title").click();
    await this.page.getByPlaceholder("Title").fill(title);
  }

  async typeListItem(value: string) {
    await this.page
      .getByRole("listitem")
      .getByRole("textbox")
      .last()
      .fill(value);
  }

  async addListItem(value: string) {
    await this.page.getByLabel("Add new").click();
    await this.typeListItem(value);
  }

  async clickSave(isUpdate?: boolean) {
    await this.page.getByRole("button", { name: "Save" }).click();

    const appBar = this.page.getByTestId("app-alert-bar");

    await expect(
      appBar.getByText(isUpdate ? "Updated entry" : "Added entry"),
    ).toBeVisible();

    this.scrapId = await appBar.getAttribute("data-related-entity-id");

    return this.scrapId;
  }

  getListItemByText(value: string) {
    return this.page
      .getByTestId("scrap-" + this.scrapId)
      .locator("li")
      .filter({ hasText: value });
  }

  getListItem(index: number, depth: number) {
    return this.page
      .getByTestId("scrap-" + this.scrapId)
      .getByTestId(`item-${index}:${depth}`);
  }

  async dblClickToEdit() {
    if (!this.scrapId) {
      throw new Error("Cannot double click on a non-saved entry");
    }

    await this.page.getByTestId("scrap-" + this.scrapId).dblclick();
  }
}
