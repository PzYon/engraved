import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import { setUpOnSignal } from "./setUpOnSignal";
import { useAppContext } from "../AppContext";

export const PwaSettingsPage: React.FC = () => {
  const { user } = useAppContext();

  return (
    <Page pageType="settings" title="PWA Settings" documentTitle="PWA Settings">
      <PageSection title="Notifications">
        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              setUpOnSignal(user.globalUniqueId);
            }}
          >
            Enable notifications
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
