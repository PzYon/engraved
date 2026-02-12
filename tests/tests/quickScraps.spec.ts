import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { navigateToEntriesPage, navigateToHome } from "../src/utils/navigateTo";
import { JournalsPage } from "../src/poms/journalsPage";

const scrapTitle = "Quick Scrap Title";
const scrapContent = "This is my content...";

test("Quick add", async ({ page }) => {
  await login(page, "quickScraps", "Scraps", "My Manual Quick Scraps");

  await navigateToHome(page);
  const journalsPage = new JournalsPage(page);

  const quickScrapDialog = await journalsPage.clickAddQuickScrapAction();
  await quickScrapDialog.typeTitle(scrapTitle);
  await quickScrapDialog.typeContent(scrapContent);
  await quickScrapDialog.clickSave();

  const entriesPage = await navigateToEntriesPage(page);
  await entriesPage.expectItem(0, scrapTitle, scrapContent);
});
