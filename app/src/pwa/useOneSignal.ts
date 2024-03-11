import { useEffect } from "react";
import { envSettings } from "../env/envSettings";
import OneSignal from "react-onesignal";

let isInitialized = false;

export const useOneSignal = (userId: string) => {
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    isInitialized = true;

    OneSignal.init({
      appId: envSettings.notifications.appId,
      allowLocalhostAsSecureOrigin: envSettings.isDev,
      notificationClickHandlerAction: "focus",
      notificationClickHandlerMatch: "origin",
    }).then(() => {
      OneSignal.login(userId);

      OneSignal.Notifications.addEventListener("click", (e) => {
        alert(`Notification button "${e.result.actionId}" was clicked.`);
      });
    });
  }, []);
};
