import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { ScrapListComponent } from "./scrapListComponent";

export class ScrapsJournalPage extends JournalPage {
  async expectIsEmpty() {
    await expect(this.page.getByText("Nothing here...")).toBeVisible();
  }

  async addList() {
    await this.clickPageAction("Add entry");

    await this.page.getByLabel("Change type to list", { exact: true }).click();

    return new ScrapListComponent(this.page);
  }
}
