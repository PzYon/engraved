import { test } from "@playwright/test";

export function isAndroidTest() {
  const projectName = test.info().project?.name;
  return projectName?.includes("android");
}
