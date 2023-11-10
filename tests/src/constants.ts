const countersPerTestName: Record<string, number> = {};

function getCounter(testName: string) {
  if (!countersPerTestName[testName]) {
    countersPerTestName[testName] = 0;
  }

  countersPerTestName[testName]++;
  return countersPerTestName[testName];
}

function getUserName(testName: string) {
  return `e2e-${testName}-${getCounter(testName)}-${getDateTimeString()}`;
}

function getDateTimeString() {
  return new Date()
    .toJSON()
    .split(".")[0]
    .replace(/-/g, "")
    .replace("T", "-")
    .replace(/:/g, "");
}

export function getStartUrl(testName: string) {
  const userName = getUserName(testName);

  console.log(`Using username '${userName}'`);

  return `http://localhost:3000?test_user=${userName}`;
}
