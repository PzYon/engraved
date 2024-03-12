import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";

export const PwaSettingsPage: React.FC = () => {
  return (
    <Page pageType="settings" title="PWA Settings" documentTitle="PWA Settings">
      <PageSection title="Notifications">
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
