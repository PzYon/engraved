import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { envSettings } from "../env/envSettings";

let appInsights: ApplicationInsights;

export function setUpAppInsights() {
  if (envSettings.isDev) {
    return;
  }

  console.log("Setting up app insights");

  appInsights = new ApplicationInsights({
    config: {
      connectionString: envSettings.appInsightsConnectionString,
    },
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export function logExceptionToAppInsights(e: Error) {
  if (envSettings.isDev) {
    console.log("Logging to App Insights: " + e.message);
    return;
  }

  appInsights.trackException({
    exception: e,
    // consider adding some custom properties like "is mobile" or something like that...
    // customProperties: {},
  });
}
