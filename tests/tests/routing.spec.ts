import { expect } from "@playwright/test";
import { test } from "../src/fixtures";
import { addNewJournal } from "../src/utils/addNewJournal";
import { navigateToHome } from "../src/utils/navigateTo";
import { isAndroidTest } from "../src/utils/isAndroidTest";

test.describe("routing", () => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(
    ({ viewport }) => isAndroidTest(viewport),
    "already covered by the desktop run",
  );

  // ---------------------------------------------------------------------------
  // Basic route navigation
  // ---------------------------------------------------------------------------

  test("navigates to /entries via tab", async ({ page }) => {
    await navigateToHome(page);

    await page.getByRole("tab", { name: "Entries" }).click();
    await page.waitForURL((url) => url.pathname === "/entries");
    await expect(page).toHaveURL(/\/entries/);
  });

  test("navigates to /scheduled via tab", async ({ page }) => {
    await navigateToHome(page);

    await page.getByRole("tab", { name: "Scheduled" }).click();
    await page.waitForURL((url) => url.pathname === "/scheduled");
    await expect(page).toHaveURL(/\/scheduled/);
  });

  test("navigates to /tags via menu", async ({ page }) => {
    await navigateToHome(page);

    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Tags" }).click();
    await page.waitForURL((url) => url.pathname === "/tags");
    await expect(page).toHaveURL(/\/tags/);
  });

  test("navigates to /search via header button", async ({ page }) => {
    await navigateToHome(page);

    await page.getByLabel("Search anything").click();
    await page.waitForURL((url) => url.pathname === "/search");
    await expect(page).toHaveURL(/\/search/);
  });

  test("navigates to /settings via user avatar", async ({ page }) => {
    await navigateToHome(page);

    await page.locator("a[href='/settings']").click();
    await page.waitForURL((url) => url.pathname === "/settings");
    await expect(page).toHaveURL(/\/settings/);
  });

  // ---------------------------------------------------------------------------
  // URL params: /journals/details/:journalId
  // ---------------------------------------------------------------------------

  test("navigates to journal detail page — URL contains journalId", async ({
    page,
    testData,
  }) => {
    const { journals } = await testData.seed({
      journals: [{ name: "Router Test Journal", type: "Gauge" }],
    });
    const entityId = journals[0].journalId;

    await page.goto("/");

    await page.getByRole("link", { name: "Router Test Journal" }).click();

    await page.waitForURL((url) =>
      url.pathname.startsWith("/journals/details/"),
    );

    const url = new URL(page.url());
    expect(url.pathname).toMatch(/^\/journals\/details\/[a-zA-Z0-9]+/);

    // The journalId in the URL should match the created journal
    expect(url.pathname).toContain(entityId);
  });

  test("navigates to journal edit page — URL ends with /edit", async ({
    page,
  }) => {
    const journalPage = await addNewJournal(page, "Value", "Edit Route Test");
    await journalPage.navigateToEditPage();

    await page.waitForURL((url) => url.pathname.endsWith("/edit"));
    await expect(page).toHaveURL(/\/edit$/);
  });

  test("navigating back from edit page returns to journal detail", async ({
    page,
  }) => {
    const journalPage = await addNewJournal(
      page,
      "Value",
      "Back Navigation Journal",
    );

    const editPage = await journalPage.navigateToEditPage();
    await page.waitForURL((url) => url.pathname.endsWith("/edit"));

    await editPage.clickSave();

    await page.waitForURL(
      (url) =>
        url.pathname.startsWith("/journals/details/") &&
        !url.pathname.endsWith("/edit"),
    );
    await expect(page).not.toHaveURL(/\/edit$/);
  });

  // ---------------------------------------------------------------------------
  // Search params (action-key, selected-item)
  // ---------------------------------------------------------------------------

  test("opening delete action adds search params to URL", async ({ page }) => {
    const journalPage = await addNewJournal(
      page,
      "Value",
      "Search Param Journal",
    );

    await journalPage.navigateToDeleteJournalAction();

    const url = new URL(page.url());
    expect(url.searchParams.get("action-key")).toBe("delete");
    expect(url.searchParams.get("selected-item")).toBeTruthy();
  });

  test("cancelling delete action removes search params from URL", async ({
    page,
  }) => {
    const journalPage = await addNewJournal(
      page,
      "Value",
      "Cancel Delete Journal",
    );

    await journalPage.navigateToDeleteJournalAction();

    // cancel the action via the "No" button
    await page.getByRole("button", { name: "No", exact: true }).click();

    // cancelling the action removes its search param from the URL (this assertion
    // auto-retries until the navigation has settled)
    await expect(page).not.toHaveURL(/action-key=delete/);
  });

  // ---------------------------------------------------------------------------
  // /tags/:tagId route
  // ---------------------------------------------------------------------------

  test("navigates to tag detail page — URL contains tagId", async ({
    page,
  }) => {
    await navigateToHome(page);

    // Go to tags page first
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Tags" }).click();
    await page.waitForURL((url) => url.pathname === "/tags");

    // If there are tags, click the first one
    const firstTag = page.locator("a[href^='/tags/']").first();
    const tagCount = await firstTag.count();

    if (tagCount > 0) {
      await firstTag.click();
      await page.waitForURL((url) => url.pathname.startsWith("/tags/"));
      const url = new URL(page.url());
      expect(url.pathname).toMatch(/^\/tags\/.+/);
    }
    // If no tags, just verify we're on the tags page correctly
    else {
      await expect(page).toHaveURL(/\/tags/);
    }
  });

  // ---------------------------------------------------------------------------
  // Home / fallback route
  // ---------------------------------------------------------------------------

  test("home route (/) shows journal and entries tabs", async ({ page }) => {
    await navigateToHome(page);

    await expect(page).toHaveURL(/^http:\/\/[^/]+\/$/);
    await expect(page.getByRole("tab", { name: "Journals" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Entries" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Scheduled" })).toBeVisible();
  });

  test("unknown route falls back to home page", async ({ page }) => {
    // wait for the app to be authenticated and loaded (auth result stored) before
    // navigating again, otherwise the second navigation can race the bootstrap
    await expect(page.getByRole("tab", { name: "Journals" })).toBeVisible();

    await page.goto("/this-route-does-not-exist");

    // Should show the home/journals content (fallback route)
    await expect(page.getByRole("tab", { name: "Journals" })).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // /quick-add route
  // ---------------------------------------------------------------------------

  test("quick-add page is reachable via URL", async ({ page }) => {
    await navigateToHome(page);

    await page.getByLabel("Quick Add").click();
    await page.waitForURL((url) => url.pathname === "/quick-add");
    await expect(page).toHaveURL(/\/quick-add/);
  });

  // ---------------------------------------------------------------------------
  // /go-to route
  // ---------------------------------------------------------------------------

  test("go-to page is reachable and navigatable", async ({ page }) => {
    await navigateToHome(page);

    await page.getByLabel("Go to").click();
    await page.waitForURL((url) => url.pathname === "/go-to");
    await expect(page).toHaveURL(/\/go-to/);
  });
});
