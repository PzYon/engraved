import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/?test_user=herbert");
});

test.describe("app", () => {
  test("renders empty application", async ({ page }) => {
    await expect(page).toHaveTitle(/engraved/);

    await expect(page.getByText("Overview")).toBeVisible();
  });

  test('adds new journal of type "Value"', async ({ page }) => {
    // given
    await page.getByLabel("Add journal").nth(2).click();

    await page.getByLabel("Name").fill("My First Value Journal");

    await page.getByLabel("Scraps").click();
    await page.getByText("Value").click();

    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("This is my description");

    // when
    await page.getByRole("button", { name: "Create" }).click();

    // then
    await expect(page).toHaveTitle("My First Value Journal | engraved.");
  });

  test("shows new journal in overview", async ({ page }) => {
    await expect(page.getByText("My First Value Journal")).toBeVisible();
  });
});
