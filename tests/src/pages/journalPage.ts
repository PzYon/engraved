import { expect } from "@playwright/test";
import { clickPageAction } from "../utils";
import { BasePage } from "./basePage";
import { JournalEditPage } from "./journalEditPage";

export class JournalPage extends BasePage {
  get tableRows() {
    return this.page
      .getByTestId("entries-table")
      .locator("tbody")
      .getByRole("row");
  }

  async openJournalEditPage(): Promise<JournalEditPage> {
    await clickPageAction(this.page, "Edit");
    return new JournalEditPage(this.page);
  }

  async addValue(value: string) {
    await clickPageAction(this.page, "Add Entry");

    await this.page.getByLabel("Value").click();
    await this.page.getByLabel("Value").fill(value);
    await this.page.getByRole("button", { name: "Add" }).click();

    expect(this.page.getByText("Added entry")).toBeVisible();
  }

  async validateHasNoEntries() {
    await expect(this.page.getByText("No entries available.")).toBeVisible();
  }

  async validateNumberOfTableRows(number: number) {
    await expect(this.tableRows).toHaveCount(number);
  }

  async expectTableCellToHaveValue(value: string) {
    await expect(
      this.tableRows.getByRole("cell", { name: value, exact: true }),
    ).toBeVisible();
  }
}
