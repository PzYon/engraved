import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";

export interface IPageContext {
  documentTitle: string;
  setDocumentTitle: (documentTitle: string) => void;
  pageTitle: React.ReactNode;
  setPageTitle: (pageTitle: React.ReactNode) => void;
  pageActions: IIconButtonAction[];
  setPageActions: (actions: IIconButtonAction[]) => void;
}

const PageContext = createContext<IPageContext>({
  documentTitle: null,
  setDocumentTitle: null,
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
  const [documentTitle, setDocumentTitle] = useState<string>(undefined);
  const [pageTitle, setPageTitle] = useState<React.ReactNode>(undefined);
  const [pageActions, setPageActions] = useState<IIconButtonAction[]>([]);

  useEffect(() => {
    document.title = documentTitle
      ? documentTitle + " | engraved."
      : "engraved.";
  }, [documentTitle]);

  const contextValue = useMemo(() => {
    return {
      documentTitle,
      setDocumentTitle,
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
