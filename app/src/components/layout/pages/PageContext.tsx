import React, { createContext, useContext, useMemo, useState } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";

export interface IPageContext {
  pageTitle: React.ReactNode;
  setPageTitle: (pageTitle: React.ReactNode) => void;
  pageActions: IIconButtonAction[];
  setPageActions: (actions: IIconButtonAction[]) => void;
}

const PageContext = createContext<IPageContext>({
  pageTitle: null,
  setPageTitle: null,
  pageActions: null,
  setPageActions: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState<React.ReactNode>(undefined);
  const [pageActions, setPageActions] = useState<IIconButtonAction[]>([]);

  const contextValue = useMemo(() => {
    return {
      pageTitle,
      setPageTitle,
      pageActions,
      setPageActions,
    };
  }, [pageTitle, pageActions]);

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};
