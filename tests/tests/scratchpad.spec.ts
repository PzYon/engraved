import { test } from "../src/fixtures";
import { JournalsPage } from "../src/poms/journalsPage";
import { ScratchpadPage } from "../src/poms/scratchpadPage";

test("scratchpad keeps what is saved across reloads", async ({ page }) => {
  const journalsPage = new JournalsPage(page);

  await journalsPage.clickScratchpadAction();

  const scratchpadPage = new ScratchpadPage(page);
  await scratchpadPage.clickEdit();
  await scratchpadPage.typeContent("Remember the milk");
  await scratchpadPage.clickSave();

  await scratchpadPage.expectContent("Remember the milk");

  await page.reload();

  await scratchpadPage.expectContent("Remember the milk");

  await scratchpadPage.doubleClickContent("Remember the milk");
  await scratchpadPage.expectEditor();
});
