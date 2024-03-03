import { AppHeader } from "./components/layout/AppHeader";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { AppContent } from "./components/layout/AppContent";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppFooter } from "./components/layout/AppFooter";
import { styled } from "@mui/material";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => {
      alert("Service Worker registered");
    })
    .catch((error) => {
      alert("Error registering the Service Worker: " + error.title);
    });
}

export const AppHost: React.FC = () => {
  function registerNotifications() {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        randomNotification();
      } else {
        alert(result);
      }
    });
  }

  function randomNotification() {
    const options = { body: "Hallo Vater" };
    new Notification("Moin.", options);
  }

  return (
    <Host>
      <AppHeader />
      <AppAlertBar />
      <div
        style={{ backgroundColor: "deeppink" }}
        onClick={() => registerNotifications()}
      >
        Register notifications
      </div>
      <AppContent scope="body">
        <AppErrorBoundary>
          <AppRoutes />
        </AppErrorBoundary>
      </AppContent>
      <AppFooter />
    </Host>
  );
};

const Host = styled("div")`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
