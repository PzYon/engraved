import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { ScrapListComponent } from "./scrapListComponent";

export class ScrapsJournalPage extends JournalPage {
  async expectIsEmpty() {
    await expect(this.page.getByText("Nothing here...")).toBeVisible();
  }

  async addList() {
    await this.clickPageAction("Add entry");

    await expect(this.page.getByTestId("add-new-scrap")).toBeVisible();

    if (await this.isMarkdown()) {
      await this.page
        .getByRole("button", { name: "Change type to list" })
        .click();

      // wtf!? why this? because this is required for some reason to
      // make the test work on CI (linux?
      if (await this.isMarkdown()) {
        await this.page
          .getByRole("button", { name: "Change type to list" })
          .click();
      }
    }

    await expect(this.page.getByTestId("item-0:0")).toBeVisible();

    return new ScrapListComponent(this.page);
  }

  async addMarkdownWithTitle(title: string) {
    await this.clickPageAction("Add entry");

    await this.getTitleBox().click();
    await this.getTitleBox().fill(title);
    await this.getTitleBox().press("Alt+s");

    const appBar = this.page.getByTestId("app-alert-bar");
    await expect(appBar.getByText("Added entry")).toBeVisible();
    await expect(appBar).not.toBeVisible({ timeout: 10000 });
  }

  private async isMarkdown() {
    return (
      (await this.page
        .getByTestId("add-new-scrap")
        .locator("[data-scrap-type='List']")
        .count()) === 0
    );
  }

  private getTitleBox() {
    return this.page.getByTestId("placeholder-Title");
  }
}
