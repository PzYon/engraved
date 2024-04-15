import { BasePage } from "./basePage";

export class ScheduledPage extends BasePage {
  async expectToShowEntity(entityId: string) {
    return await this.page
      .getByTestId("page")
      .getByTestId(entityId)
      .isVisible();
  }
}
