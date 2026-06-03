import { expect, Page, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { navigateToHome } from "../src/utils/navigateTo";
import { JournalsPage } from "../src/poms/journalsPage";

// Three journals are seeded for every test. Navigation tests assert focus by
// list position (index), so the order does not matter. The filter tests rely
// on the names: "ap" matches Apple + Apricot but not Avocado, while "a"
// matches all three.
const journalNames = ["Apple", "Apricot", "Avocado"];

// Run this file's tests sequentially. Each test bootstraps a fresh e2e
// user and creates journals; doing several of these concurrently triggers a
// server-side race where the new user's journals never show up in the list
// query. Serial execution avoids that. The 60s timeout covers the (slower)
// per-test UI seeding plus the reload-poll in seedJournals.
test.describe.configure({ mode: "serial", timeout: 60_000 });

async function seedJournals(page: Page): Promise<JournalsPage> {
  for (const name of journalNames) {
    await addNewJournal(page, "Value", name);
    await navigateToHome(page);
  }

  const journalsPage = new JournalsPage(page);

  // Right after creating journals the list endpoint briefly returns an empty
  // array (server-side read-after-write race). The app fetches the list once
  // per navigation and does not auto-retry, so the empty result sticks on
  // screen. Reload-poll re-fetches until the list is populated.
  await expect(async () => {
    await page.reload();
    await expect(journalsPage.items()).toHaveCount(journalNames.length, {
      timeout: 750,
    });
  }).toPass({ timeout: 20_000, intervals: [500, 1000, 1500] });

  return journalsPage;
}

test.beforeEach(async ({ page }) => {
  await login(page, "overview-list-nav");
});

// --- arrow navigation ---

test("ArrowDown with no selection focuses the first item", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();

  await list.expectFocusedItem(0);
});

test("ArrowUp with no selection focuses the last item", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowUp();

  await list.expectFocusedItem(2);
});

test("ArrowDown moves focus to the next item", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();
  await list.expectFocusedItem(0);

  await list.arrowDown();
  await list.expectFocusedItem(1);
});

test("ArrowUp moves focus to the previous item", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();
  await list.arrowDown();
  await list.expectFocusedItem(1);

  await list.arrowUp();
  await list.expectFocusedItem(0);
});

test("ArrowDown wraps from the last item to the first", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowUp();
  await list.expectFocusedItem(2);

  await list.arrowDown();
  await list.expectFocusedItem(0);
});

test("ArrowUp wraps from the first item to the last", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();
  await list.expectFocusedItem(0);

  await list.arrowUp();
  await list.expectFocusedItem(2);
});

// --- type-to-filter ---

test("typing narrows the list to matching items", async ({ page }) => {
  const list = await seedJournals(page);

  await list.typeToFilter("ap");

  await list.expectToShowNEntities(2);
  await list.expectItemVisible("Apple");
  await list.expectItemVisible("Apricot");
  await list.expectItemHidden("Avocado");
});

test("backspace widens the filtered list again", async ({ page }) => {
  const list = await seedJournals(page);

  await list.typeToFilter("ap");
  await list.expectToShowNEntities(2);

  await list.pressBackspace();

  await list.expectToShowNEntities(3);
  await list.expectItemVisible("Avocado");
});

test("escape clears the filter and restores the full list", async ({
  page,
}) => {
  const list = await seedJournals(page);

  await list.typeToFilter("ap");
  await list.expectToShowNEntities(2);

  await list.pressEscape();

  await list.expectToShowNEntities(3);
});
