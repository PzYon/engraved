import React, { createContext, useContext, useMemo, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IUser } from "./serverApi/IUser";

export interface IAppContext {
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  user: IUser;
}

const AppContext = createContext<IAppContext>({
  appAlert: null,
  setAppAlert: null,
  user: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);

  const contextValue = useMemo(() => {
    return {
      appAlert,
      setAppAlert,
      user,
    };
  }, [appAlert, user]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
