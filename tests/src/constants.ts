import { Page } from "@playwright/test";

const countersPerTestName: Record<string, number> = {};

function getCounter(testName: string) {
  if (!countersPerTestName[testName]) {
    countersPerTestName[testName] = 0;
  }

  countersPerTestName[testName]++;
  return countersPerTestName[testName];
}

function getUserName(testName: string) {
  return `${testName}-${getCounter(testName)}-${getDateTimeString()}@e2e.tests`;
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

  await page.goto(`http://localhost:3000?test_user=${userName}`);

  return userName;
}
