import { expect, test } from "@playwright/test";
import { constants } from "../src/constants";
import { addNewJournal, navigateToHome } from "../src/utils";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new quick scrap", async ({ page }) => {
  await addNewJournal(page, "Scraps", "My Manual Quick Scraps");
  await navigateToHome(page);

  await page.getByLabel("Add Quick Scrap").click();

  await page.getByLabel("Add to journal");

  await page.getByPlaceholder("Title").click();
  await page.getByPlaceholder("Title").fill("Quick Scrap Title");
  await page.getByPlaceholder("Title").press("Tab");
  await page.getByRole("textbox").nth(1).fill("This is my content...");

  await page.getByLabel("Save").click();

  await expect(page.getByText("Added entry")).toBeVisible();

  await page.getByRole("tab", { name: "Entries" }).click();

  await expect(
    page.getByTestId("entries-list-item-0").getByText("Quick Scrap Title"),
  ).toBeVisible();
  await expect(
    page.getByTestId("entries-list-item-0").getByText("This is my content..."),
  ).toBeVisible();
});
