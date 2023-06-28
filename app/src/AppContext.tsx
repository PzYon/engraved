import React, { createContext, useContext, useMemo, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IUser } from "./serverApi/IUser";

export interface IAppContext {
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  user: IUser;
  newVersion: boolean;
  setNewVersion: () => void;
}

const AppContext = createContext<IAppContext>({
  appAlert: null,
  setAppAlert: null,
  user: null,
  newVersion: false,
  setNewVersion: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);
  const [newVersion, setNewVersion] = useState(false);

  const contextValue = useMemo(() => {
    return {
      appAlert,
      setAppAlert,
      user,
      newVersion,
      setNewVersion: () => setNewVersion(true),
    };
  }, [appAlert, user, newVersion]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
