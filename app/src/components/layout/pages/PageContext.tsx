import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { IAction } from "../../common/actions/IAction";
import { ITab } from "../tabs/ITab";

export interface IPageContext {
  documentTitle: string;
  setDocumentTitle: (documentTitle: string) => void;
  title: React.ReactNode;
  setTitle: (title: React.ReactNode) => void;
  subTitle: React.ReactNode;
  setSubTitle: (subTitle: React.ReactNode) => void;
  pageActions: IAction[];
  setPageActions: (actions: IAction[]) => void;
  // consider moving below props to a SearchContext
  enableFilters: boolean;
  setEnableFilters: (value: boolean) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  metricTypes: MetricType[];
  setMetricTypes: (metricTypes: MetricType[]) => void;
  tabs: ITab[];
  setTabs: (tabs: ITab[]) => void;
}

const PageContext = createContext<IPageContext>({
  documentTitle: null,
  setDocumentTitle: null,
  title: null,
  setTitle: null,
  subTitle: null,
  setSubTitle: null,
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
  tabs: null,
  setTabs: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [title, setTitle] = useState<React.ReactNode>(undefined);
  const [subTitle, setSubTitle] = useState<React.ReactNode>(undefined);
  const [documentTitle, setDocumentTitle] = useState<string>(undefined);
  const [pageActions, setPageActions] = useState<IAction[]>([]);
  const [enableFilters, setEnableFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);
  const [tabs, setTabs] = useState<ITab[]>([]);

  useEffect(() => {
    document.title = documentTitle
      ? documentTitle + " | engraved."
      : "engraved.";
  }, [documentTitle]);

  const contextValue = useMemo(() => {
    return {
      documentTitle,
      setDocumentTitle,
      title,
      setTitle,
      subTitle,
      setSubTitle,
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
      tabs,
      setTabs,
    };
  }, [
    title,
    subTitle,
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
