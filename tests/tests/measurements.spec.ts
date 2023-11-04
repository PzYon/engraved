import { expect, Page, test } from "@playwright/test";
import { addNewJournal, clickPageAction } from "./utils";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new value journal, adds entries", async ({ page }) => {
  await addNewJournal(page, "Journal with values", "Value");

  await addNewValue(page, "23");
  await addNewValue(page, "19.5");

  const rows = page
    .getByTestId("entries-table")
    .locator("tbody")
    .getByRole("row");

  await expect(rows).toHaveCount(2);

  await expect(
    rows.getByRole("cell", { name: "23", exact: true }),
  ).toBeVisible();
  await expect(
    rows.getByRole("cell", { name: "19.5", exact: true }),
  ).toBeVisible();
});

async function addNewValue(page: Page, value: string) {
  await clickPageAction(page, "Add Entry");

  await page.getByLabel("Value").click();
  await page.getByLabel("Value").fill(value);
  await page.getByRole("button", { name: "Add" }).click();

  expect(page.getByText("Added entry")).toBeVisible();
}
