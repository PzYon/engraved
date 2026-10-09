import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { envSettings } from "../env/envSettings";

let appInsights: ApplicationInsights | undefined;

export function setUpAppInsights() {
  if (appInsights || !enableAppInsights()) {
    return;
  }

  console.log("Setting up app insights");

  appInsights = new ApplicationInsights({
    config: {
      connectionString: envSettings.appInsightsConnectionString,
      // "unload" is deprecated and blocked by the browsers' default permissions policy.
      // The SDK still hooks "pagehide" and "visibilitychange" to flush telemetry.
      disablePageUnloadEvents: ["unload"],
    },
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export function logExceptionToAppInsights(e: Error) {
  if (!enableAppInsights()) {
    console.error("Logging to App Insights: " + e.message, e);
    return;
  }

  // The regular setup waits until the browser is idle, and an error can well
  // be earlier than that.
  setUpAppInsights();

  appInsights?.trackException({
    exception: e,
    // consider adding some custom properties like "is mobile" or something like that...
    // customProperties: {},
  });
}

function enableAppInsights() {
  if (envSettings.isDev) {
    return false;
  }

  if (!envSettings.appInsightsConnectionString) {
    console.log("Missing appInsightsConnectionString from env config");
    return false;
  }

  return true;
}
