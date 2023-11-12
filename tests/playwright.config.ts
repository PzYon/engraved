import { defineConfig, devices } from "@playwright/test";

const cdnBaseUrl = "http://localhost:3000";
const apiBaseUrl = "http://localhost:5072";

const isCi = process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!isCi,
  retries: isCi ? 2 : 0,
  reporter: isCi ? [["list"], ["github"]] : [["list"], ["html"]],
  use: {
    baseURL: cdnBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run e2e:start-app",
      url: cdnBaseUrl,
      reuseExistingServer: !isCi,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "npm run e2e:start-api",
      url: apiBaseUrl,
      reuseExistingServer: !isCi,
      stdout: "ignore",
      stderr: "pipe",
      // for some reason, this api server takes a long
      // time to start on CI
      timeout: 120 * 1000,
      ignoreHTTPSErrors: true,
    },
  ],
});
