import { test } from "@playwright/test";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new journal, updates journal", async ({ page }) => {
  await page.getByLabel("Add Quick Scrap").click();

  await page.getByPlaceholder("Title").click();
  await page.getByPlaceholder("Title").fill("Quick Scrap Title");
  await page.getByPlaceholder("Title").press("Tab");
  await page.getByRole("textbox").nth(1).fill("This is my content...");

  await page.getByLabel("Save").click();

  await page.getByText("Added entry").isVisible();

  await page.getByRole("tab", { name: "Entries" }).click();

  await page.getByText("Quick Scrap Title").isVisible();
  await page.getByText("This is my content...").isVisible();
});
