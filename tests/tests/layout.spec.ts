import { expect, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToHome } from "../src/utils/navigateTo";
import { createJournalViaApi } from "../src/utils/apiClient";

test("does not display floating actions if not necessary", async ({ page }) => {
  await login(page, "layout");
  await navigateToHome(page);
  await expect(page.getByTestId("floating-header-actions")).toBeHidden();
});

test("does display floating actions if necessary (on scroll down)", async ({
  page,
  request,
}) => {
  const userName = await login(page, "layout");

  for (let i = 0; i < 10; i++) {
    await createJournalViaApi(request, userName, {
      name: `Use some space ${i}`,
      description: `Test journal ${i + 1} for testing`,
      journalType: "Gauge",
    });
  }

  await navigateToHome(page);
  await page.reload();

  const journalsPage = new JournalsPage(page);
  await journalsPage.expectToShowNEntities(10);

  await journalsPage.scrollToBottom();
  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});
