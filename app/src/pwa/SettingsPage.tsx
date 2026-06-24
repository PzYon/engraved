import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Alert, AlertTitle, Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import { optInPushNotifications, setUpOneSignal } from "../util/oneSignal";
import { useAppContext } from "../AppContext";
import React from "react";
import { ManageUserTags } from "../components/overview/tags/ManageUserTags";
import { CleanupUserTags } from "../components/overview/tags/CleanupUserTags";
import { ExportYourData } from "./ExportYourData";

export const SettingsPage: React.FC = () => {
  const { user, setAppAlert } = useAppContext();

  return (
    <Page title="Settings" documentTitle="Settings" actions={[]}>
      <PageSection title="Tags">
        <ManageUserTags />
      </PageSection>

      <PageSection title="Cleanup tags">
        <CleanupUserTags />
      </PageSection>

      <PageSection title="PWA Notifications">
        <p>
          <Button
            variant="outlined"
            onClick={() => {
              setUpOneSignal(user.globalUniqueId ?? "");
            }}
          >
            Setup OneSignal
          </Button>
        </p>

        <p>
          <Button
            variant="outlined"
            onClick={() => {
              optInPushNotifications();
            }}
          >
            Enable push notifications
          </Button>
        </p>

        <p>
          <Button
            variant="outlined"
            onClick={() => {
              ServerApi.sendTestNotification();
            }}
          >
            Show test notification via OneSignal.
          </Button>
        </p>

        {isAndroid() ? (
          <Alert severity="info">
            <AlertTitle>Not receiving notifications on Android?</AlertTitle>
            Android battery optimization can stop the browser/installed app from
            receiving push notifications in the background, even though they are
            sent successfully. To fix this, open your system settings and set
            battery usage for your browser (or the installed engraved. app) to{" "}
            <strong>Unrestricted</strong> (Settings → Apps → your browser →
            Battery), and make sure background data is allowed.
          </Alert>
        ) : null}
      </PageSection>

      <PageSection title="Export your data">
        <ExportYourData />
      </PageSection>

      <PageSection title="Devices">
        <Button variant="outlined" onClick={signOutOtherDevices}>
          Sign out other devices
        </Button>
      </PageSection>

      <PageSection title="System">
        <Button variant="outlined" onClick={clearBackendCache}>
          Clear backend cache
        </Button>
      </PageSection>
    </Page>
  );

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  async function clearBackendCache() {
    try {
      await ServerApi.clearBackendCache();
      setAppAlert({
        title: "Backend cache cleared",
        type: "success",
      });
    } catch (e) {
      setAppAlert({
        title: "Failed to clear backend cache",
        message: (e as Error)?.message,
        type: "error",
      });
    }
  }

  async function signOutOtherDevices() {
    try {
      await ServerApi.signOutOtherDevices();
      setAppAlert({
        title: "Signed out other devices",
        type: "success",
      });
    } catch (e) {
      setAppAlert({
        title: "Failed to sign out other devices",
        message: (e as Error)?.message,
        type: "error",
      });
    }
  }
};
