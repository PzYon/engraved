import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";
import { FilterMode, PageContext } from "./PageContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { JournalType } from "../../../serverApi/JournalType";
import {
  knownQueryParams,
  useEngravedSearchParams,
} from "../../common/actions/searchParamHooks";

export const PageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { appendSearchParams, getSearchParam } = useEngravedSearchParams();

  const paramSearchText = getSearchParam("q") ?? "";
  const paramJournalTypes = getSearchParam("journalTypes");

  const [title, setTitle] = useState<React.ReactNode>(undefined);
  const [subTitle, setSubTitle] = useState<React.ReactNode>(undefined);
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [hideActions, setHideActions] = useState(false);
  const [pageActions, setPageActions] = useState<IAction[]>([]);
  const [pageActionRoutes, setPageActionRoutes] =
    useState<React.ReactElement | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.None);
  const [tabs, setTabs] = useState<IPageTab[]>([]);

  const journalTypes: JournalType[] = useMemo(
    () =>
      (paramJournalTypes?.split(",").filter((j) => j) as JournalType[]) ?? [],
    [paramJournalTypes],
  );

  const setSearchText = useCallback(
    (value: string) => {
      appendSearchParams({
        [knownQueryParams.query]: value,
        journalTypes: paramJournalTypes ?? "",
      });
    },
    [appendSearchParams, paramJournalTypes],
  );

  const setJournalTypes = useCallback(
    (value: JournalType[]) => {
      appendSearchParams({
        [knownQueryParams.query]: paramSearchText,
        journalTypes: value.join(","),
      });
    },
    [appendSearchParams, paramSearchText],
  );

  useEffect(() => {
    document.title = [
      documentTitle,
      paramSearchText ? `Search '${paramSearchText}'` : null,
      "engraved.",
    ]
      .filter((v) => v)
      .join(" | ");
  }, [documentTitle, paramSearchText]);

  const contextValue = useMemo(
    () => ({
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
      setSearchText,
      journalTypes,
      setJournalTypes,
      tabs,
      setTabs,
    }),
    [
      title,
      subTitle,
      documentTitle,
      pageActions,
      pageActionRoutes,
      hideActions,
      showFilters,
      filterMode,
      paramSearchText,
      setSearchText,
      journalTypes,
      setJournalTypes,
      tabs,
    ],
  );

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};
