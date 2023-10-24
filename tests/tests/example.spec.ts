import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  // load client
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/engraved/);

  const pagePromise = page.waitForEvent("popup");
  await page
    .frameLocator('iframe[title="Schaltfläche „Über Google anmelden“"]')
    .getByLabel("Über Google anmelden")
    .click();

  const loginPopup = await pagePromise;
  await loginPopup.getByLabel("Email or phone").click();
  await loginPopup.getByLabel("Email or phone").fill("");
  await loginPopup.getByLabel("Email or phone").press("Enter");

  await loginPopup.getByLabel("Enter your password").click();

  await loginPopup.getByLabel("Enter your password").fill("");
});
