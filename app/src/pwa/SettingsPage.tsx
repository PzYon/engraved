import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import { optInPushNotifications, setUpOneSignal } from "../util/oneSignal";
import { useAppContext } from "../AppContext";
import React from "react";
import { ManageUserTags } from "../components/overview/tags/ManageUserTags";

export const SettingsPage: React.FC = () => {
  const { user } = useAppContext();

  return (
    <Page title="Settings" documentTitle="Settings">
      <PageSection title="Tags">
        <ManageUserTags />
      </PageSection>
      <PageSection title="PWA Notifications">
        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              setUpOneSignal(user.globalUniqueId);
            }}
          >
            Setup OneSignal
          </Button>
        </p>

        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              optInPushNotifications();
            }}
          >
            Enable push notifications
          </Button>
        </p>

        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              ServerApi.sendTestNotification();
            }}
          >
            Show test notification via OneSignal.
          </Button>
        </p>
      </PageSection>
    </Page>
  );
};
