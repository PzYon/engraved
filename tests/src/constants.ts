const constants = {
  baseUrl: "http://localhost:3000",
};

export function getStartUrl(testName: string, counter: string) {
  return `${constants.baseUrl}?test_user=e2e-${testName}-${counter}`;
}
