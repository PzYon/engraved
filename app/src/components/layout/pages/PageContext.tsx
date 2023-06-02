import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { MetricType } from "../../../serverApi/MetricType";

export interface IPageContext {
  documentTitle: string;
  setDocumentTitle: (documentTitle: string) => void;
  pageTitle: React.ReactNode;
  setPageTitle: (pageTitle: React.ReactNode) => void;
  pageActions: IIconButtonAction[];
  setPageActions: (actions: IIconButtonAction[]) => void;
  // consider moving below props to a SearchContext
  enableFilters: boolean;
  setEnableFilters: (value: boolean) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  metricTypes: MetricType[];
  setMetricTypes: (metricTypes: MetricType[]) => void;
}

const PageContext = createContext<IPageContext>({
  documentTitle: null,
  setDocumentTitle: null,
  pageTitle: null,
  setPageTitle: null,
  pageActions: null,
  setPageActions: null,
  enableFilters: null,
  setEnableFilters: null,
  showFilters: null,
  setShowFilters: null,
  searchText: null,
  setSearchText: null,
  metricTypes: null,
  setMetricTypes: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [documentTitle, setDocumentTitle] = useState<string>(undefined);
  const [enableFilters, setEnableFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);
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
      enableFilters,
      setEnableFilters,
      showFilters,
      setShowFilters,
      searchText,
      setSearchText,
      metricTypes,
      setMetricTypes,
    };
  }, [
    pageTitle,
    documentTitle,
    pageActions,
    searchText,
    metricTypes,
    enableFilters,
    showFilters,
  ]);

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};
