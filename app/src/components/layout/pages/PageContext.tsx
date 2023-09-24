import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IIconButtonAction } from "../../common/actions/IconButtonWrapper";
import { MetricType } from "../../../serverApi/MetricType";

export interface IPageContext {
  documentTitle: string;
  setDocumentTitle: (documentTitle: string) => void;
  title: React.ReactNode;
  setTitle: (title: React.ReactNode) => void;
  subTitle: React.ReactNode;
  setSubTitle: (subTitle: React.ReactNode) => void;
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
  const [pageActions, setPageActions] = useState<IIconButtonAction[]>([]);
  const [enableFilters, setEnableFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);

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
