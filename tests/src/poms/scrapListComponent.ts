import { expect, Page } from "@playwright/test";
import { isAndroidTest } from "../utils/mobile";

export class ScrapListComponent {
  private scrapId: string;

  constructor(
    private page: Page,
    scrapId: string = "new",
  ) {
    this.scrapId = scrapId;
  }

  async typeTitle(title: string) {
    await this.page.getByTestId("placeholder-Title").click();
    await this.page.getByTestId("placeholder-Title").fill(title);
  }

  async typeListItem(value: string) {
    const lastItem = this.page
      .getByRole("listitem")
      .getByRole("textbox")
      .last();

    await lastItem.waitFor({ state: "visible" });
    await lastItem.fill(value);
  }

  async addListItem(value: string) {
    await this.page.getByLabel("Add new").click();
    await this.typeListItem(value);
  }

  async clickSave(isUpdate?: boolean) {
    await this.page.getByRole("button", { name: "Save" }).click();

    const appBar = this.page.getByTestId("app-alert-bar");
    await expect(appBar).toContainText(
      isUpdate ? "Updated entry" : "Added entry",
    );

    this.scrapId = await appBar.getAttribute("data-related-entity-id");

    return this.scrapId;
  }

  async selectItem(index: number) {
    await this.getListItem(index, 0).click();
    await expect(this.getListItem(index, 0).getByRole("textbox")).toBeFocused();
  }

  async getListItemByText(value: string) {
    if (isAndroidTest()) {
      await this.page.getByTestId("scrap-" + this.scrapId).click();
    }

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

  getItemCount(): Promise<number> {
    return this.page
      .getByTestId("scrap-" + this.scrapId)
      .locator("li")
      .count();
  }

  async dblClickToEdit() {
    if (!this.scrapId) {
      throw new Error("Cannot double click on a non-saved entry");
    }

    await this.clickToExpand();

    await this.page.getByTestId("scrap-" + this.scrapId).dblclick();
  }

  async clickToExpand() {
    if (isAndroidTest()) {
      await this.page.getByTestId("scrap-" + this.scrapId).click();
    }
  }
}
