import { test, ViewportSize } from "@playwright/test";

export function isAndroidTest(viewport?: ViewportSize) {
  if (viewport) {
    return viewport.width < 500;
  }

  const projectName = test.info().project?.name;
  return projectName?.includes("android") ?? false;
}
