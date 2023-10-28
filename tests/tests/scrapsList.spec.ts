import { expect, test } from "@playwright/test";
import { addNewJournal } from "./utils";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/?test_user=herbert");
});

const journalName = "My First Scraps";

test.describe("app", () => {
  test("adds new scrap journal, adds list and adds some items to it", async ({
    page,
  }) => {
    await addNewJournal(page, journalName, "Scraps");

    await expect(page.getByText("My First Scraps")).toBeVisible();
    await expect(page.getByText("Nothing here...")).toBeVisible();

    await page.getByLabel("Add list").nth(2).click();
    await page.getByPlaceholder("Title").click();
    await page.getByPlaceholder("Title").fill("This is my title");
    await page.getByLabel("Add new").click();
    await page.getByRole("listitem").getByRole("textbox").fill("My First Item");

    await page.getByLabel("Add new").click();
    await page.getByRole("textbox").nth(2).fill("My Second Item");

    await page.getByLabel("Save").click();

    await expect(page.getByText("Added entry")).toBeVisible();
  });
});
