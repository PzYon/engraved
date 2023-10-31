import { Page, test } from "@playwright/test";
import { addNewJournal } from "./utils";
import { constants } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const journalName = "My First Scraps Journal";

test("adds new scrap journal, adds list and adds some items to it", async ({
  page,
}) => {
  await addNewJournal(page, journalName, "Scraps");

  await page.getByText("Nothing here...").isVisible();

  await page.getByLabel("Add list").nth(2).click();

  await page.getByPlaceholder("Title").click();
  await page.getByPlaceholder("Title").fill("This is my title");

  await addListItem(page, "My First Item");
  await addListItem(page, "My Second Item");

  await page.getByRole("button", { name: "Save" }).click();

  await page.getByText("Added entry").isVisible();

  await page.getByText("My Second Item").dblclick();

  await page
    .locator("li")
    .filter({ hasText: "My Second Item" })
    .getByLabel("Delete")
    .click();

  await page
    .locator("li")
    .filter({ hasText: "My First Item" })
    .getByRole("checkbox")
    .check();
});

async function addListItem(page: Page, value: string) {
  await page.getByLabel("Add new").click();
  await page.getByRole("listitem").getByRole("textbox").last().fill(value);
}
