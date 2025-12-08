import { expect } from "@playwright/test";
import { OverviewPage } from "./overviewPage";
import { isAndroidTest } from "../utils/mobile";

export class EntriesPage extends OverviewPage {
  async expectItem(index: number, title: string, content: string) {
    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(title),
    ).toBeVisible();

    if (isAndroidTest()) {
      await this.page.getByTestId("entries-list-item-" + index).click();
    }

    await expect(
      this.page.getByTestId("entries-list-item-" + index).getByText(content),
    ).toBeVisible();
  }
}
