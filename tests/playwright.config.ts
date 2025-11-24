import { defineConfig, devices } from "@playwright/test";

const cdnBaseUrl = "http://localhost:3000";
const apiBaseUrl = "http://localhost:5072";

const threeMinutes = 3 * 60 * 1000;

const isCi = process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!isCi,
  // we don't want retries in CI to prevent flaky tests
  retries: 0, // isCi ? 2 : 0,
  reporter: isCi ? [["list"], ["github"]] : [["list"], ["html"]],
  use: {
    baseURL: cdnBaseUrl,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
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
      name: "App",
      command: "npm run e2e:start-app",
      url: cdnBaseUrl,
      reuseExistingServer: !isCi,
      stdout: "pipe",
      stderr: "pipe",
      // when building the app for production, it can take
      // a longer time than when running in dev mode
      timeout: threeMinutes,
    },
    {
      name: "Server",
      command: "npm run e2e:start-api",
      url: apiBaseUrl,
      reuseExistingServer: !isCi,
      stdout: isCi ? undefined : "pipe",
      stderr: "pipe",
      // for some reason, this api server takes a long
      // time to start on CI
      timeout: threeMinutes,
      ignoreHTTPSErrors: true,
    },
  ],
});
