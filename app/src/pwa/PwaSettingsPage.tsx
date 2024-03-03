import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { EngravedServiceWorker } from "./EngravedServiceWorker";
import { Button } from "@mui/material";

export const PwaSettingsPage: React.FC = () => {
  return (
    <Page pageType="settings" title="PWA Settings" documentTitle="PWA Settings">
      <PageSection>
        <Button
          variant={"outlined"}
          onClick={() => {
            EngravedServiceWorker.instance.showNotification("Hello", {
              body: "I am test.",
              actions: [
                {
                  title: "Ok",
                  action: "ok",
                },
              ],
            });
          }}
        >
          Send a test notification
        </Button>
      </PageSection>
    </Page>
  );
};
