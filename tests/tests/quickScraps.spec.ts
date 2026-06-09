import { test } from "../src/fixtures";
import { navigateToEntriesPage, navigateToHome } from "../src/utils/navigateTo";
import { JournalsPage } from "../src/poms/journalsPage";

const scrapTitle = "Quick Scrap Title";
const scrapContent = "This is my content...";

test("Quick add", async ({ page, testData }) => {
  await testData.seed({
    journals: [{ name: "My Manual Quick Scraps", type: "Scraps" }],
  });

  await navigateToHome(page);
  await page.reload();

  const journalsPage = new JournalsPage(page);

  const quickScrapDialog = await journalsPage.clickAddQuickScrapAction();
  await quickScrapDialog.typeTitle(scrapTitle);
  await quickScrapDialog.typeContent(scrapContent);
  await quickScrapDialog.clickSave();

  const entriesPage = await navigateToEntriesPage(page);
  await entriesPage.expectItem(0, scrapTitle, scrapContent);
});
