import { test as base } from "@playwright/test";
import { login } from "./utils/login";
import { TestData } from "./api/testData";

interface EngravedFixtures {
  userName: string;
  testData: TestData;
}

export const test = base.extend<EngravedFixtures>({
  // `auto` so every test logs in (and creates its user) up front, mirroring the
  // per-spec `beforeEach(login)` it replaces. Tests that need the value can
  // still request `userName`.
  userName: [
    async ({ page }, use, testInfo) => {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);

      const userName = await login(page, testName);
      await use(userName);
    },
    { auto: true },
  ],

  testData: async ({ playwright, userName }, use) => {
    const request = await playwright.request.newContext();
    await use(new TestData(request, userName));
    await request.dispose();
  },
});
