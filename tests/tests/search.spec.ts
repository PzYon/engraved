import { test } from "../src/fixtures";
import { navigateToSearchPage } from "../src/utils/navigateTo";

test("finds entry by title match", async ({ page, testData }) => {
  await testData.seed({
    journals: [
      {
        name: "My Journal",
        type: "Scraps",
        entries: [{ title: "Alpine Trek" }],
      },
    ],
  });

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Alpine");
  await searchPage.expectResultVisible("Alpine Trek");
});

test("finds entry by content match", async ({ page, testData }) => {
  await testData.seed({
    journals: [
      {
        name: "My Journal",
        type: "Scraps",
        entries: [{ title: "Walk notes", notes: "unexplored canyon route" }],
      },
    ],
  });

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("canyon");
  await searchPage.expectResultVisible("Walk notes");
});

test("finds journal by name match", async ({ page, testData }) => {
  await testData.seed({
    journals: [{ name: "Birding Log", type: "Scraps" }],
  });

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Birding");
  await searchPage.expectResultVisible("Birding Log");
});

test("finds journal by description match", async ({ page, testData }) => {
  await testData.seed({
    journals: [
      {
        name: "Field Journal",
        type: "Scraps",
        description: "wetland observations",
      },
    ],
  });

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("wetland");
  await searchPage.expectResultVisible("Field Journal");
});

test("returns both entries and journals when both match", async ({
  page,
  testData,
}) => {
  await testData.seed({
    journals: [
      {
        name: "Geology Study",
        type: "Scraps",
        entries: [{ title: "Geology Study notes" }],
      },
    ],
  });

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Geology Study");
  await searchPage.expectResultVisible("Geology Study");
  await searchPage.expectResultVisible("Geology Study notes");
});

test("shows no results for non-matching search", async ({ page }) => {
  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("zzznomatch999");
  await searchPage.expectNoResults();
});

test("narrows and widens search updates results", async ({
  page,
  testData,
}) => {
  await testData.seed({
    journals: [
      {
        name: "Wildlife Journal",
        type: "Scraps",
        entries: [
          { title: "Red Fox" },
          { title: "Red Kite" },
          { title: "Blue Jay" },
        ],
      },
    ],
  });

  const searchPage = await navigateToSearchPage(page);

  await searchPage.search("Red");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultVisible("Red Kite");
  await searchPage.expectResultNotVisible("Blue Jay");

  await searchPage.search("Red Fox");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultNotVisible("Red Kite");

  await searchPage.clearSearch();
  await searchPage.search("Red");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultVisible("Red Kite");
});
