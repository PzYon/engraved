import { Page } from "@playwright/test";

export class ScheduledPage {
  constructor(private page: Page) {}

  async expectToShowEntity(entityId: string) {
    return await this.page
      .getByTestId("page")
      .getByTestId(entityId)
      .isVisible();
  }
}
