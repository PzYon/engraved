import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class ScheduledPage extends BasePage {
  async expectToShowEntity(entityId: string) {
    return await expect(this.page.getByTestId(entityId)).toBeVisible();
  }
}
