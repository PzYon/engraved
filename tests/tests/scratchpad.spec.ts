import { test } from "../src/fixtures";
import { JournalsPage } from "../src/poms/journalsPage";

test("scratchpad keeps what is typed across reloads", async ({ page }) => {
  const journalsPage = new JournalsPage(page);

  const scratchpadPage = await journalsPage.clickScratchpadAction();
  await scratchpadPage.typeContent("Remember the milk");
  await scratchpadPage.expectSaved();

  await page.reload();

  await scratchpadPage.expectContent("Remember the milk");
  await scratchpadPage.expectSaved();
});
