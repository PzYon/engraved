import React, { createContext, useContext, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IAction } from "./components/layout/HeaderActions";
import { IUser } from "./serverApi/IUser";

export interface IAppContext {
  pageTitle: React.ReactNode;
  setPageTitle: (pageTitle: React.ReactNode) => void;
  titleActions: IAction[];
  setTitleActions: (actions: IAction[]) => void;
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  user: IUser;
}

const AppContext = createContext<IAppContext>({
  pageTitle: null,
  setPageTitle: null,
  appAlert: null,
  setAppAlert: null,
  titleActions: null,
  setTitleActions: null,
  user: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC<{ user: IUser }> = ({
  children,
  user,
}) => {
  const [pageTitle, setPageTitle] = useState<React.ReactNode>(undefined);
  const [titleActions, setTitleActions] = useState<IAction[]>([]);
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);

  return (
    <AppContext.Provider
      value={{
        pageTitle,
        setPageTitle,
        titleActions: titleActions,
        setTitleActions: setTitleActions,
        appAlert: appAlert,
        setAppAlert: setAppAlert,
        user: user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
