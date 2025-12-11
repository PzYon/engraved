import { defineConfig, devices } from "@playwright/test";

const pixel9Pro = {
  name: "Pixel 9 Pro",
  device: {
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 3.5,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
};

const cdnBaseUrl = "http://localhost:3000";
const apiBaseUrl = "http://localhost:5072";

const threeMinutes = 3 * 60 * 1000;

const isCi = process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: isCi ? 4 : undefined,
  forbidOnly: !!isCi,
  retries: 0,
  reporter: isCi ? [["list"], ["html"], ["github"]] : [["list"], ["html"]],
  use: {
    baseURL: cdnBaseUrl,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "android",
      use: {
        browserName: "chromium",
        ...pixel9Pro.device,
        ignoreHTTPSErrors: true,
      },
    },
  ],
  webServer: [
    {
      name: "App",
      command: isCi ? "npm run e2e:start-app:ci" : "npm run e2e:start-app",
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
      command: isCi ? "npm run e2e:start-api:ci" : "npm run e2e:start-api",
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
