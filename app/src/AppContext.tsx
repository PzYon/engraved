import React, { createContext, useContext, useMemo, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IUser } from "./serverApi/IUser";

export interface IAppContext {
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  user: IUser;
  setUser: (user: IUser) => void;
}

const AppContext = createContext<IAppContext>({
  appAlert: null,
  setAppAlert: null,
  user: null,
  setUser: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user: initialUser }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);
  const [user, setUser] = useState(initialUser);

  const contextValue = useMemo(() => {
    return {
      appAlert,
      setAppAlert,
      user,
      setUser,
    };
  }, [appAlert, user]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
