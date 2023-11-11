import { Page } from "@playwright/test";

export async function clickPageAction(page: Page, name: string) {
  await page.getByTestId("page-actions").getByLabel(name).click();
}
