import { expect } from "@playwright/test";
import { JournalPage } from "./journalPage";
import { DeleteAction } from "./deleteAction";
import { isAndroidTest } from "../utils/mobile";

export class MetricJournalPage extends JournalPage {
  get tableRows() {
    return this.page
      .getByTestId("entries-table")
      .locator("tbody")
      .getByRole("row");
  }

  async addValue(value: string) {
    await this.clickPageAction("Add entry");

    await this.page.getByLabel("Value", { exact: true }).click();
    await this.page.getByLabel("Value", { exact: true }).fill(value);
    await this.page.getByRole("button", { name: "Add entry" }).click();

    await expect(this.page.getByText("Added entry")).toBeVisible();
  }

  async navigateToDeleteJournalAction() {
    await this.clickPageAction("Delete journal");
    return new DeleteAction(this.page, "Journal");
  }

  async validateHasNoEntries() {
    await expect(this.page.getByText("No entries available.")).toBeVisible();
  }

  async validateNumberOfTableRows(number: number) {
    await expect(this.tableRows).toHaveCount(this.getRowIndex(number));
  }

  async expectTableCellToHaveValue(value: string) {
    await expect(
      this.tableRows.getByRole("cell", { name: value, exact: true }),
    ).toBeVisible();
  }

  async navigateToDeleteEntryAction(index: number) {
    await this.tableRows
      .nth(this.getRowIndex(index))
      .getByLabel("Delete entry")
      .click();
    return new DeleteAction(this.page, "Entry");
  }
  private getRowIndex(index: number) {
    return isAndroidTest() ? index - 1 : index;
  }
}
