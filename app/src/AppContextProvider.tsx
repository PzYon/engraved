import { IUser } from "./serverApi/IUser";
import React, { useMemo, useState } from "react";
import { AppAlertContext, AppContext, IAppContext } from "./AppContext";
import { ServerApi } from "./serverApi/ServerApi";
import { IAppAlert } from "./components/errorHandling/IAppAlert";

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user: initialUser }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert | null>(null);
  const [user, setUser] = useState(initialUser);

  // The user handed in changes when a sign-in completes after the app has been
  // started with the user remembered from last time (see Bootstrapper), which
  // is the up-to-date one from then on.
  const [lastInitialUser, setLastInitialUser] = useState(initialUser);
  if (lastInitialUser !== initialUser) {
    setLastInitialUser(initialUser);
    setUser(initialUser);
  }

  const contextValue = useMemo<IAppContext>(() => {
    return {
      setAppAlert,
      user,
      setUser,
      reloadUser: async () => {
        const reloadedUser = await ServerApi.getCurrentUser();
        setUser(reloadedUser);
      },
    };
  }, [user]);

  return (
    <AppContext.Provider value={contextValue}>
      <AppAlertContext.Provider value={appAlert}>
        {children}
      </AppAlertContext.Provider>
    </AppContext.Provider>
  );
};
