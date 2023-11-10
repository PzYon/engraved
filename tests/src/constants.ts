const constants = {
  baseUrl: "http://localhost:3000",
};

function getDateTimeString() {
  return new Date()
    .toJSON()
    .split(".")[0]
    .replace(/-/g, "")
    .replace("T", "-")
    .replace(/:/g, "");
}

function getUserName(testName: string, counter: string) {
  return `e2e-${testName}-${counter}-${getDateTimeString()}`;
}

export function getStartUrl(testName: string, counter: string) {
  const userName = getUserName(testName, counter);

  console.log(`Using username '${userName}'`);

  return `${constants.baseUrl}?test_user=${userName}`;
}
