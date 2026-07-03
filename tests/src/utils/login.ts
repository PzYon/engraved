import { Page } from "@playwright/test";

function getUniqueRandomId() {
  return Math.random().toString().split(".")[1].substring(0, 5);
}

function getUserName(testName: string) {
  return `${testName}-${getUniqueRandomId()}.${getDateTimeString()}@tests.e2e`;
}

function getDateTimeString() {
  return new Date()
    .toJSON()
    .split(".")[0]
    .replace(/-/g, "")
    .replace("T", "-")
    .replace(/:/g, "");
}

export async function login(page: Page, testName: string) {
  const userName = getUserName(testName);
  console.log(`Using username '${userName}'`);

  // wait only for the document, not the full "load" event: a slow/blocked subresource
  // must not stall navigation. The page-actions wait below is the real readiness signal.
  await page.goto(`/?test-user=${userName}`, { waitUntil: "domcontentloaded" });

  await page.getByTestId("page-actions").waitFor({ state: "visible" });

  return userName;
}
