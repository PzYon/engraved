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

  async resetEndDateToNow(index: number) {
    await this.tableRows.nth(index).getByLabel("Edit entry").click();

    // the end date is the second (last) date selector in the timer form
    await this.page.getByRole("button", { name: "now" }).last().click();
    await this.page.getByRole("button", { name: "Update entry" }).click();

    await expect(this.page.getByText("Updated entry")).toBeVisible();
  }

  async validateNumberOfTableRows(expected: number) {
    await expect(this.tableRows).toHaveCount(expected);
  }

  async openAddEntryFullForm() {
    await this.clickPageAction("Add entry");
    await this.page.getByLabel("Show full form").click();
  }

  async moveStartDateFiveMinutesIntoFuture() {
    // the start date is the first date selector in the timer form
    await this.page.getByRole("button", { name: "+5min" }).first().click();
  }

  async expectDurationToMatch(pattern: RegExp) {
    await expect(this.page.getByText(pattern)).toBeVisible();
  }
}
