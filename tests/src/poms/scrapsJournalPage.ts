import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { ScrapListComponent } from "./scrapListComponent";

export class ScrapsJournalPage extends JournalPage {
  async expectIsEmpty() {
    await expect(this.page.getByText("Nothing here...")).toBeVisible();
  }

  async addList() {
    await this.clickPageAction("Add entry");

    // why do we need this?
    await this.page.waitForTimeout(1000);

    await this.page.getByLabel("Change type to list").click();

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
