import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { ScrapListComponent } from "./scrapListComponent";

export class ScrapsJournalPage extends JournalPage {
  async expectIsEmpty() {
    await expect(this.page.getByText("Nothing here...")).toBeVisible();
  }

  async addList() {
    await this.clickPageAction("Add entry");

    // todo: consider somehow ensuring here that we are actually in list mode?
    // e.g. by  setting a mode attribute on the component?
    //await this.page.getByLabel("Change type to list").click();

    await this.page
      .getByRole("button", { name: "Change type to list" })
      .click();

    return new ScrapListComponent(this.page);
  }

  async addMarkdownWithTitle(title: string) {
    await this.clickPageAction("Add entry");

    await this.page.getByRole("textbox", { name: "Title" }).click();
    await this.page.getByRole("textbox", { name: "Title" }).fill(title);
    await this.page.getByRole("textbox", { name: "Title" }).press("Alt+s");

    const appBar = this.page.getByTestId("app-alert-bar");
    await expect(appBar.getByText("Added entry")).toBeVisible();
    await expect(appBar).not.toBeVisible({ timeout: 10000 });
  }
}
