import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { JournalType } from "../../../serverApi/JournalType";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";

export enum FilterMode {
  None = 0,
  Text = 1 << 0,
  JournalType = 1 << 1,
  All = Text | JournalType,
}

export type PageType =
  | "journal"
  | "overview"
  | "search"
  | "add-journal"
  | "move-scrap";

export interface IPageContext {
  documentTitle: string;
  setDocumentTitle: (documentTitle: string) => void;
  title: React.ReactNode;
  setTitle: (title: React.ReactNode) => void;
  subTitle: React.ReactNode;
  setSubTitle: (subTitle: React.ReactNode) => void;
  pageActions: IAction[];
  setPageActions: (actions: IAction[]) => void;
  hideActions: boolean;
  setHideActions: (value: boolean) => void;
  // consider moving below props to a SearchContext
  filterMode: FilterMode;
  setFilterMode: (value: FilterMode) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  journalTypes: JournalType[];
  setJournalTypes: (journalTypes: JournalType[]) => void;
  tabs: IPageTab[];
  setTabs: (tabs: IPageTab[]) => void;
  pageType: PageType;
  setPageType: (pageType: PageType) => void;
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
  hideActions: null,
  setHideActions: null,
  filterMode: null,
  setFilterMode: null,
  showFilters: null,
  setShowFilters: null,
  searchText: null,
  setSearchText: null,
  journalTypes: null,
  setJournalTypes: null,
  tabs: null,
  setTabs: null,
  pageType: null,
  setPageType: null,
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
  const [hideActions, setHideActions] = useState(false);
  const [pageActions, setPageActions] = useState<IAction[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.None);
  const [searchText, setSearchText] = useState<string>("");
  const [journalTypes, setJournalTypes] = useState<JournalType[]>([]);
  const [tabs, setTabs] = useState<IPageTab[]>([]);
  const [pageType, setPageType] = useState<PageType>(undefined);

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
      hideActions,
      setHideActions,
      filterMode,
      setFilterMode,
      showFilters,
      setShowFilters,
      searchText,
      setSearchText,
      journalTypes,
      setJournalTypes,
      tabs,
      setTabs,
      pageType,
      setPageType,
    };
  }, [
    title,
    subTitle,
    documentTitle,
    pageActions,
    hideActions,
    showFilters,
    filterMode,
    searchText,
    journalTypes,
    tabs,
    pageType,
  ]);

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};
