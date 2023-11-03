import { test } from "@playwright/test";
import { addNewJournal } from "./utils";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const journalName = "My First Scraps Journal";

test("adds new scrap journal, adds list and adds some items to it", async ({
  page,
}) => {
  await addNewJournal(page, "Journal with values", "Value");

  await page.getByRole("button", { name: "Add Entry" }).click();
  await page.getByLabel("Value").click();
  await page.getByLabel("Value").fill("23");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByText("Added entry").click();
});
