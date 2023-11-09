import { expect, test } from "@playwright/test";
import { getStartUrl } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";

let counter = 1;

test.beforeEach(async ({ page }) => {
  await page.goto(getStartUrl("layout", (counter++).toString()));
});

test("does not display floating actions if not necessary", async ({ page }) => {
  await waitUntilPageReady(page);
  await expect(page.getByTestId("floating-header-actions")).toBeHidden();
});

test("does display floating actions if necessary (on scroll down)", async ({
  page,
}) => {
  // add some journals so we can scroll
  for (let i = 0; i < 1; i++) {
    const journalPage = await addNewJournal(
      page,
      "Value",
      "Use some space " + i,
    );

    await journalPage.navigateToHome();
  }

  await page.reload();

  //  await page.waitForTimeout(3000);

  await waitUntilPageReady(page);

  await new JournalsPage(page).scrollToBottom();
  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});

async function waitUntilPageReady(page) {
  // wait for title to be rendered completely
  return await page.getByRole("link", { name: "engraved." }).click();
}
