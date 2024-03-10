import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { IUser } from "./serverApi/IUser";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";
import { AppHost } from "./AppHost";
import { PageContextProvider } from "./components/layout/pages/PageContextProvider";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContextProvider";
import { AppContextProvider } from "./AppContextProvider";
import OneSignal from "react-onesignal";
import { envSettings } from "./env/envSettings";

export const App: React.FC<{ user: IUser }> = ({ user }) => {
  // todo: custom hook and make sure it is only called once!!
  const [didInitialize, setDidInitialize] = useState(false);

  useEffect(() => {
    if (didInitialize) {
      return;
    }

    setDidInitialize(true);

    OneSignal.init({
      appId: envSettings.notifications.appId,
      allowLocalhostAsSecureOrigin: envSettings.isDev,
    }).then(() => {
      OneSignal.login(user.globalUniqueId);
    });
  }, []);

  return (
    <AppContextProvider user={user}>
      <ReactQueryProviderWrapper>
        <BrowserRouter>
          <PageContextProvider>
            <DialogContextProvider>
              <AppHost />
            </DialogContextProvider>
          </PageContextProvider>
        </BrowserRouter>
      </ReactQueryProviderWrapper>
    </AppContextProvider>
  );
};
