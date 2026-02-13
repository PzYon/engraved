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

export async function login(
  page: Page,
  testName: string,
  journalType?: "Counter" | "Gauge" | "Timer" | "Scraps",
  journalName?: string,
) {
  const userName = getUserName(testName);
  console.log(`Using username '${userName}'`);

  await page.goto(
    `/?test-user=${userName}&test-journal-name=${journalName ?? ""}&test-journal-type=${journalType ?? ""}`,
  );

  return userName;
}
