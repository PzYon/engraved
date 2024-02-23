import { IAction } from "../../common/actions/IAction";
import { JournalType } from "../../../serverApi/JournalType";
import { IPageTab } from "../tabs/IPageTab";
import { FilterMode, PageContext, PageType } from "./PageContext";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramSearchText = searchParams?.get("q") ?? "";
  const paramJournalTypes = searchParams?.get("journalTypes") ?? "";

  const [title, setTitle] = useState<React.ReactNode>(undefined);
  const [subTitle, setSubTitle] = useState<React.ReactNode>(undefined);
  const [documentTitle, setDocumentTitle] = useState<string>(undefined);
  const [hideActions, setHideActions] = useState(false);
  const [pageActions, setPageActions] = useState<IAction[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.None);
  const [searchText, setSearchText] = useState<string>(paramSearchText);
  const [journalTypes, setJournalTypes] = useState<JournalType[]>([]);
  const [tabs, setTabs] = useState<IPageTab[]>([]);
  const [pageType, setPageType] = useState<PageType>(undefined);

  useEffect(() => {
    const params: {
      q?: string;
      journalTypes?: string;
    } = {};

    if (searchText) {
      params["q"] = searchText;
    }

    if (journalTypes.length) {
      params["journalTypes"] = journalTypes.join(",");
    }

    setSearchParams(params);
  }, [journalTypes, searchText, setSearchParams]);

  useEffect(() => {
    if (!paramSearchText) {
      return;
    }
    setSearchText(paramSearchText);
  }, [paramSearchText]);

  useEffect(() => {
    if (!paramJournalTypes) {
      return;
    }
    setJournalTypes(paramJournalTypes.split(",") as JournalType[]);
  }, [paramJournalTypes]);

  useEffect(() => {
    document.title = [
      documentTitle,
      searchText ? `Search '${searchText}'` : null,
      "engraved.",
    ]
      .filter((v) => v)
      .join(" | ");
  }, [documentTitle, searchText]);

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
