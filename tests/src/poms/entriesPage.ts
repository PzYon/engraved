import { expect } from "@playwright/test";
import { OverviewPage } from "./overviewPage";

export class EntriesPage extends OverviewPage {
  async expectItem(index: number, title: string, content: string) {
    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(title),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(content),
    ).toBeVisible();
  }
}
