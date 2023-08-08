import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const appInsights = new ApplicationInsights({
  config: {
    connectionString: "xxx",
  },
});

export function setUpAppInsights() {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export function logException(e: Error) {
  appInsights.trackException({
    exception: e,
  });
}
