import { Page } from "@playwright/test";

export async function navigateToHome(page: Page) {
  await page.getByRole("link", { name: "engraved." }).click();
  await page.waitForURL((url) => url.pathname === "/");
}
