import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { DeleteDialog } from "./deleteDialog";

export class MetricJournalPage extends JournalPage {
  get tableRows() {
    return this.page
      .getByTestId("entries-table")
      .locator("tbody")
      .getByRole("row");
  }

  async addValue(value: string) {
    await this.clickPageAction("Add Entry");

    await this.page.getByLabel("Value").click();
    await this.page.getByLabel("Value").fill(value);
    await this.page.getByRole("button", { name: "Add" }).click();

    await expect(this.page.getByText("Added entry")).toBeVisible();
  }

  async navigateToDeleteJournalDialog() {
    await this.clickPageAction("Delete");
    return new DeleteDialog(this.page, "Journal");
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

  async navigateToDeleteEntryDialog(index: number) {
    await this.tableRows.nth(index).getByLabel("Delete").click();
    return new DeleteDialog(this.page, "Entry");
  }
}
