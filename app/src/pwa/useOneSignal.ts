import { useEffect } from "react";
import { envSettings } from "../env/envSettings";
import OneSignal from "react-onesignal";
import { useAppContext } from "../AppContext";

let isInitialized = false;

export const setUpOnSignal = (oneSignalUserId: string) => {
  OneSignal.init({
    appId: envSettings.notifications.appId,
    allowLocalhostAsSecureOrigin: envSettings.isDev,
    notificationClickHandlerAction: "focus",
    notificationClickHandlerMatch: "origin",
  }).then(() => {
    OneSignal.login(oneSignalUserId)
      .then((r) => {
        console.log("OneSignal login result:", r);
      })
      .catch((e) => {
        console.error("OneSignal login error:", e);
      });

    OneSignal.Notifications.addEventListener("click", (e) => {
      alert(`Notification button "${e.result?.actionId}" was clicked.`);
    });
  });
};

export const useOneSignal = () => {
  const { user } = useAppContext();

  useEffect(() => {
    if (isInitialized || !user?.id) {
      return;
    }

    isInitialized = true;
    setUpOnSignal(user.globalUniqueId);
  }, [user]);
};
