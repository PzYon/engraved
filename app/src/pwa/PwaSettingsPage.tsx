import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import { optInPushNotifications, setUpOneSignal } from "./oneSignal";
import { useAppContext } from "../AppContext";

export const PwaSettingsPage: React.FC = () => {
  const { user } = useAppContext();

  return (
    <Page title="PWA Settings" documentTitle="PWA Settings">
      <PageSection title="Notifications">
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
