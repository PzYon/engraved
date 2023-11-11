import { expect, Page, test } from "@playwright/test";
import { login } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToHome } from "../src/utils/navigateToHome";

test.beforeEach(async ({ page }) => {
  await login(page, "layout");
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
