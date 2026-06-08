import { test as base } from "@playwright/test";
import { login } from "./utils/login";
import { TestData } from "./api/testData";

interface EngravedFixtures {
  /**
   * An authenticated e2e test user. Logging in via the app establishes the
   * browser session (persisted in localStorage) and creates the user on the
   * backend. The returned value is the username, which doubles as the bearer
   * token in e2e mode.
   */
  userName: string;

  /**
   * Domain-level test-data builder. Seeds journals/entries via the backend in a
   * single call, scoped to the authenticated `userName`.
   */
  testData: TestData;
}

export const test = base.extend<EngravedFixtures>({
  userName: async ({ page }, use, testInfo) => {
    const testName = testInfo.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

    const userName = await login(page, testName);
    await use(userName);
  },

  testData: async ({ playwright, userName }, use) => {
    const request = await playwright.request.newContext();
    await use(new TestData(request, userName));
    await request.dispose();
  },
});
