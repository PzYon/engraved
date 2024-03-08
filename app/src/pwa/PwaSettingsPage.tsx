import { Page } from "../components/layout/pages/Page";
import { PageSection } from "../components/layout/pages/PageSection";
import { EngravedServiceWorker } from "./EngravedServiceWorker";
import { Button } from "@mui/material";

export const PwaSettingsPage: React.FC = () => {
  return (
    <Page pageType="settings" title="PWA Settings" documentTitle="PWA Settings">
      <PageSection>
        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              EngravedServiceWorker.instance.showNotification("Hello", {
                body: "I am test.",
                actions: [
                  {
                    title: "Ok",
                    action: "ok",
                  } as NotificationAction,
                ],
              } as NotificationOptions);
            }}
          >
            Show test notification
          </Button>
        </p>
        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              EngravedServiceWorker.instance.sendMessage(
                "Send a message from app to sw...",
              );
            }}
          >
            Send message to service worker
          </Button>
        </p>
        <p>
          <Button
            variant={"outlined"}
            onClick={() => {
              EngravedServiceWorker.instance.ping();
            }}
          >
            Ping!?
          </Button>
        </p>
      </PageSection>
    </Page>
  );
};
