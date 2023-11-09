import { expect, test } from "@playwright/test";
import { constants } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("does not display floating actions if not necessary", async ({ page }) => {
  await page.waitForTimeout(4000);

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

  await new JournalsPage(page).scrollToBottom();
  await page.waitForTimeout(2000);

  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});
