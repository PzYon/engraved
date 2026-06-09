import { expect } from "@playwright/test";
import { test } from "../src/fixtures";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToHome } from "../src/utils/navigateTo";

test("does not display floating actions if not necessary", async ({ page }) => {
  await navigateToHome(page);
  await expect(page.getByTestId("floating-header-actions")).toBeHidden();
});

test("does display floating actions if necessary (on scroll down)", async ({
  page,
  testData,
}) => {
  const journalsToCreate = 15;

  await testData.seed({
    journals: Array.from({ length: journalsToCreate }, (_, i) => ({
      name: `Use some space ${i}`,
      description: `Test journal ${i + 1} for testing`,
      type: "Gauge" as const,
    })),
  });

  await page.goto("/");

  const journalsPage = new JournalsPage(page);
  await journalsPage.expectToShowNEntities(journalsToCreate);

  await journalsPage.scrollToBottom();
  await expect(page.getByTestId("floating-header-actions")).toBeVisible();
});
