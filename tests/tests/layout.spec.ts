import { expect, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToHome } from "../src/utils/navigateTo";
import { createJournalViaApi } from "../src/utils/apiClient";

test.beforeEach(async ({ page }) => {
  await login(page, "layout");
});

test("does not display floating actions if not necessary", async ({ page }) => {
  await waitUntilPageReady(page);
  await expect(page.getByTestId("floating-header-actions")).toBeHidden();
});

test("does display floating actions if necessary (on scroll down)", async ({
  page,
  request,
}) => {
  for (let i = 0; i < 10; i++) {
    await createJournalViaApi(request, {
      name: `Use some space ${i}`,
      description: `Test journal ${i + 1} for testing`,
      journalType: "Gauge",
    });
  }

  await navigateToHome(page);

  await new JournalsPage(page).scrollToBottom();
  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});
