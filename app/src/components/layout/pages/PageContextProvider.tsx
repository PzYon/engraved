import { IAction } from "../../common/actions/IAction";
import { JournalType } from "../../../serverApi/JournalType";
import { IPageTab } from "../tabs/IPageTab";
import { FilterMode, PageContext, PageType } from "./PageContext";
import React, { useEffect, useMemo, useState } from "react";

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
