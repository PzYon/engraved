import React, { createContext, useContext, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";

export interface IAppContext {
  pageTitle: string;
  setPageTitle: (pageTitle: string) => void;
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
}

export const AppContext = createContext<IAppContext>({
  pageTitle: null,
  setPageTitle: null,
  appAlert: null,
  setAppAlert: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);

  return (
    <AppContext.Provider
      value={{
        pageTitle,
        setPageTitle,
        appAlert: appAlert,
        setAppAlert: setAppAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
