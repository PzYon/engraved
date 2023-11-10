import { BasePage } from "./basePage";
import { JournalsPage } from "./journalsPage";
import { JournalEditPage } from "./journalEditPage";
import { expect } from "@playwright/test";
import { navigateToHome } from "../utils/navigateToHome";

export abstract class JournalPage extends BasePage {
  async getJournalId() {
    return await this.page
      .getByTestId("journal")
      .getAttribute("data-journal-id");
  }

  async navigateToHome() {
    await navigateToHome(this.page);

    await expect(this.page.getByRole("tab", { name: "Entries" })).toBeVisible();
    await expect(
      this.page.getByRole("tab", { name: "Journals" }),
    ).toBeVisible();

    return new JournalsPage(this.page);
  }

  async navigateToEditPage(): Promise<JournalEditPage> {
    await this.clickPageAction("Edit");
    return new JournalEditPage(this.page);
  }
}
