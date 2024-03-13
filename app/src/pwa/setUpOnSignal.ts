import { envSettings } from "../env/envSettings";
import OneSignal from "react-onesignal";

export const setUpOnSignal = (oneSignalUserId: string) => {
  OneSignal.init({
    appId: envSettings.notifications.appId,
    allowLocalhostAsSecureOrigin: envSettings.isDev,
    notificationClickHandlerAction: "focus",
    notificationClickHandlerMatch: "origin",
  }).then(() => {
    OneSignal.login(oneSignalUserId)
      .then(() => {
        console.log("OneSignal login successful.");
      })
      .catch((e) => {
        console.error("OneSignal login error:", e);
      });

    OneSignal.Notifications.addEventListener("click", (e) => {
      alert(`Notification button "${e.result?.actionId}" was clicked.`);
    });
  });
};
