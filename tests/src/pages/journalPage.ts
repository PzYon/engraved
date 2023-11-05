import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { JournalEditPage } from "./journalEditPage";
import { JournalsPage } from "./journalsPage";

export class JournalPage extends BasePage {
  get tableRows() {
    return this.page
      .getByTestId("entries-table")
      .locator("tbody")
      .getByRole("row");
  }

  async navigateToHome() {
    await this.page.getByRole("link", { name: "engraved." }).click();

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

  async addValue(value: string) {
    await this.clickPageAction("Add Entry");

    await this.page.getByLabel("Value").click();
    await this.page.getByLabel("Value").fill(value);
    await this.page.getByRole("button", { name: "Add" }).click();

    await expect(this.page.getByText("Added entry")).toBeVisible();
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
