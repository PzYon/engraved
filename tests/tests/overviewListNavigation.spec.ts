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

async function seedJournals(page: Page): Promise<JournalsPage> {
  for (const name of journalNames) {
    await addNewJournal(page, "Value", name);
    await navigateToHome(page);
  }

  const journalsPage = new JournalsPage(page);
  await journalsPage.expectToShowNEntities(journalNames.length);
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

// --- item actions ---

test("alt+enter navigates into the focused journal", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();
  await list.expectFocusedItem(0);
  const journalId = await list.getFocusedItemId();

  await list.goIntoFocusedItem();

  await expect(page).toHaveURL(
    new RegExp(`/journals/details/${journalId}(\\?|$)`),
  );
  await expect(page.getByTestId("journal")).toBeVisible();
});

test("alt+e opens the focused journal's edit page", async ({ page }) => {
  const list = await seedJournals(page);

  await list.arrowDown();
  const journalId = await list.getFocusedItemId();

  await list.editFocusedItem();

  await expect(page).toHaveURL(
    new RegExp(`/journals/details/${journalId}/edit`),
  );
  await expect(page.getByLabel("Name")).toBeVisible();
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
