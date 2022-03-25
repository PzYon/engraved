import React, { createContext, useContext, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IAction } from "./components/layout/HeaderActions";

export interface IAppContext {
  pageTitle: string;
  setPageTitle: (pageTitle: string) => void;
  titleActions: IAction[];
  setTitleActions: (actions: IAction[]) => void;
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
}

export const AppContext = createContext<IAppContext>({
  pageTitle: null,
  setPageTitle: null,
  appAlert: null,
  setAppAlert: null,
  titleActions: null,
  setTitleActions: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
