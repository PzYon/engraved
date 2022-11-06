import React, { createContext, useContext, useMemo, useState } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IUser } from "./serverApi/IUser";
import { IIconButtonAction } from "./components/common/IconButtonWrapper";

export interface IAppContext {
  // todo: move these props to IPageContext
  pageTitle: React.ReactNode;
  setPageTitle: (pageTitle: React.ReactNode) => void;
  titleActions: IIconButtonAction[];
  setTitleActions: (actions: IIconButtonAction[]) => void;
  // todo: move these props to IAlertContext or INotificationContext
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  // todo: IUserContext?
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

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user }) => {
  const [pageTitle, setPageTitle] = useState<React.ReactNode>(undefined);
  const [titleActions, setTitleActions] = useState<IIconButtonAction[]>([]);
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);

  const contextValue = useMemo(() => {
    return {
      pageTitle,
      setPageTitle,
      titleActions,
      setTitleActions,
      appAlert,
      setAppAlert,
      user,
    };
  }, [pageTitle, titleActions, appAlert, user]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
