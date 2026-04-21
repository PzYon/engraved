import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import { optInPushNotifications, setUpOneSignal } from "../util/oneSignal";
import { useAppContext } from "../AppContext";
import React, { useState } from "react";
import { ManageUserTags } from "../components/overview/tags/ManageUserTags";
import { CleanupUserTags } from "../components/overview/tags/CleanupUserTags";
import { ExportYourData } from "./ExportYourData";

export const SettingsPage: React.FC = () => {
  const { user, setAppAlert } = useAppContext();
  const [isClearingCache, setIsClearingCache] = useState(false);

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
              setUpOneSignal(user.globalUniqueId);
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
      </PageSection>

      <PageSection title="Export your data">
        <ExportYourData />
      </PageSection>

      <PageSection title="System">
        <Button
          variant="outlined"
          disabled={isClearingCache}
          onClick={clearBackendCache}
        >
          Clear backend cache
        </Button>
      </PageSection>
    </Page>
  );

  async function clearBackendCache() {
    try {
      setIsClearingCache(true);
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
    } finally {
      setIsClearingCache(false);
    }
  }
};
