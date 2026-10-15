import { test } from "../src/fixtures";
import { JournalsPage } from "../src/poms/journalsPage";
import { ScratchpadPage } from "../src/poms/scratchpadPage";

test("scratchpad opens empty for editing and keeps what is saved", async ({
  page,
}) => {
  const journalsPage = new JournalsPage(page);

  await journalsPage.clickScratchpadAction();

  const scratchpadPage = new ScratchpadPage(page);
  await scratchpadPage.expectEditMode(true);
  await scratchpadPage.typeContent("Remember the milk");
  await scratchpadPage.clickSave();

  await scratchpadPage.expectContent("Remember the milk");

  await page.reload();

  await scratchpadPage.expectEditMode(false);
  await scratchpadPage.expectContent("Remember the milk");

  await scratchpadPage.doubleClickContent("Remember the milk");
  await scratchpadPage.expectEditMode(true);
});
