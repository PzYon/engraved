import { test } from "@playwright/test";
import { addNewJournal, clickPageAction } from "./utils";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new scrap journal, adds list and adds some items to it", async ({
  page,
}) => {
  await addNewJournal(page, "Journal with values", "Value");
  await clickPageAction(page, "Add Entry");

  await page.getByLabel("Value").click();
  await page.getByLabel("Value").fill("23");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByText("Added entry").click();
});
