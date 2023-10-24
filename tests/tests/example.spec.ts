import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  // load client
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/engraved/);
});
