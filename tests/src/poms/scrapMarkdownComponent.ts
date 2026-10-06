import { expect, Page } from "@playwright/test";
import { isAndroidTest } from "../utils/isAndroidTest";

export class ScrapMarkdownComponent {
  constructor(private page: Page) {}

  private getScrap() {
    return this.page
      .getByTestId("page")
      .locator("[data-scrap-type='Markdown']")
      .first();
  }

  private getEditor() {
    return this.getScrap().locator(".tiptap").last();
  }

  private getTitleEditor() {
    return this.getScrap().getByTestId("placeholder-Title");
  }

  async dblClickToEdit() {
    if (isAndroidTest()) {
      await this.getScrap().click();
    }

    await this.getScrap().dblclick();
  }

  async typeAtEnd(text: string) {
    const editor = this.getEditor();
    await editor.click();
    await this.page.keyboard.type(text);
  }

  async typeTitleAtEnd(text: string) {
    await this.getTitleEditor().click();
    await this.page.keyboard.press("End");
    await this.page.keyboard.type(text);
  }

  async clickSave() {
    await this.page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(this.page.getByTestId("app-alert-bar")).toContainText(
      "Updated entry",
    );
  }

  async cancelEditingAndDiscardChanges() {
    await this.page
      .getByRole("button", { name: "Stop editing and reset" })
      .click();
    await this.page.getByRole("button", { name: "Yeah, I'm done." }).click();

    await expect(
      this.page.getByRole("button", { name: "Save", exact: true }),
    ).toBeHidden();
  }

  async expectEditorContent(text: string) {
    await expect(this.getEditor()).toHaveText(text);
  }

  async expectTitleEditorContent(text: string) {
    await expect(this.getTitleEditor()).toHaveText(text);
  }

  // Moves focus out of the scrap (by clicking the page title), which triggers
  // the auto-save-on-blur behaviour for an existing scrap with pending changes.
  async blurToAutoSave(isUpdate?: boolean) {
    await this.page.getByTestId("page-title").click();

    const appBar = this.page.getByTestId("app-alert-bar");
    await expect(appBar).toContainText(
      isUpdate ? "Updated entry" : "Added entry",
    );
  }

  async expectContent(text: string) {
    // on mobile the scrap is rendered collapsed until it gets focus, so tap it
    // to expand before asserting on its content.
    if (isAndroidTest()) {
      await this.getScrap().click();
    }

    await expect(this.getScrap().getByText(text)).toBeVisible();
  }

  async expectNoContent(text: string) {
    await expect(this.getScrap().getByText(text)).toBeHidden();
  }
}
