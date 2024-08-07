import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";
import { FilterMode, PageContext } from "./PageContext";
import React, { useEffect, useMemo, useState } from "react";
import { JournalType } from "../../../serverApi/JournalType";
import { useEngravedSearchParams } from "../../common/actions/searchParamHooks";

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { appendSearchParams, getSearchParam } = useEngravedSearchParams();

  const paramSearchText = getSearchParam("q") ?? "";
  const paramJournalTypes = getSearchParam("journalTypes");

  const [title, setTitle] = useState<React.ReactNode>(undefined);
  const [subTitle, setSubTitle] = useState<React.ReactNode>(undefined);
  const [documentTitle, setDocumentTitle] = useState<string>(undefined);
  const [hideActions, setHideActions] = useState(false);
  const [pageActions, setPageActions] = useState<IAction[]>([]);
  const [pageActionRoutes, setPageActionRoutes] =
    useState<React.ReactElement>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.None);
  const [tabs, setTabs] = useState<IPageTab[]>([]);

  useEffect(() => {
    setUrlParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramSearchText, paramJournalTypes]);

  useEffect(() => {
    document.title = [
      documentTitle,
      paramSearchText ? `Search '${paramSearchText}'` : null,
      "engraved.",
    ]
      .filter((v) => v)
      .join(" | ");
  }, [documentTitle, paramSearchText]);

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
      pageActionRoutes,
      setPageActionRoutes,
      hideActions,
      setHideActions,
      filterMode,
      setFilterMode,
      showFilters,
      setShowFilters,
      searchText: paramSearchText,
      setSearchText: (value: string) => {
        setUrlParams({ searchText: value });
      },
      journalTypes: getJournalTypes(),
      setJournalTypes: (value: JournalType[]) => {
        setUrlParams({ journalTypes: value });
      },
      tabs,
      setTabs,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    subTitle,
    documentTitle,
    pageActions,
    pageActionRoutes,
    hideActions,
    showFilters,
    filterMode,
    paramSearchText,
    paramJournalTypes,
    tabs,
  ]);

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );

  function setUrlParams(overrides?: {
    searchText?: string;
    journalTypes?: JournalType[];
  }) {
    appendSearchParams({
      q: overrides?.searchText ?? paramSearchText,
      journalTypes: (overrides?.journalTypes ?? getJournalTypes()).join(","),
    });
  }

  function getJournalTypes(): JournalType[] {
    return (
      (paramJournalTypes?.split(",").filter((j) => j) as JournalType[]) ?? []
    );
  }
};
