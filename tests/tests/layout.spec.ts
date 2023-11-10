import { expect, Page, test } from "@playwright/test";
import { getStartUrl } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToHome } from "../src/utils/navigateToHome";

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
  for (let i = 0; i < 5; i++) {
    const journalPage = await addNewJournal(
      page,
      "Value",
      "Use some space " + i,
    );

    await journalPage.navigateToHome();
  }

  await waitUntilPageReady(page);

  await new JournalsPage(page).scrollToBottom();
  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});

async function waitUntilPageReady(page: Page) {
  // wait for title to be rendered completely
  await navigateToHome(page);
}
