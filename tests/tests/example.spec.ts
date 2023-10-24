import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  // wait for server API
  await page.goto("https://localhost:7072", {timeout: 60000});

  // load client
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/engraved/);
});
