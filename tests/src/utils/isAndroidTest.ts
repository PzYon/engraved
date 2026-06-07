export function isAndroidTest() {
  const projectName = process.env.PLAYWRIGHT_PROJECT_NAME;
  return projectName?.includes("android") ?? false;
}
