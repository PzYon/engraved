import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";

export class TimerJournalPage extends JournalPage {
  get tableRows() {
    return this.page
      .getByTestId("entries-table")
      .locator("tbody")
      .getByRole("row");
  }

  async startEntry() {
    await this.clickPageAction("Add entry");
    await this.page.getByRole("button", { name: "Add entry" }).click();

    await expect(this.page.getByText("Added entry")).toBeVisible();
  }

  async stopEntry() {
    await this.clickPageAction("Add entry");
    await this.page.getByRole("button", { name: "Update entry" }).click();

    await expect(this.page.getByText("Updated entry")).toBeVisible();
  }

  async editEntryEndDate(index: number) {
    await this.tableRows.nth(index).getByLabel("Edit entry").click();

    // the end date is the second (last) date selector in the timer form
    await this.page.getByRole("button", { name: "now" }).last().click();
    await this.page.getByRole("button", { name: "Update entry" }).click();

    await expect(this.page.getByText("Updated entry")).toBeVisible();
  }

  async validateNumberOfTableRows(expected: number) {
    await expect(this.tableRows).toHaveCount(expected);
  }
}
