import React, { useEffect } from "react";
import { FilterMode, usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";
import { useSearchParams } from "react-router-dom";

export const Page: React.FC<{
  children: React.ReactNode;
  actions?: IAction[];
  hideActions?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  tabs?: IPageTab[];
  filterMode?: FilterMode;
  showFilters?: boolean;
  pageActionRoutes?: React.ReactElement;
}> = ({
  actions,
  hideActions,
  title,
  subTitle,
  documentTitle,
  tabs,
  children,
  filterMode = FilterMode.None,
  showFilters = false,
  pageActionRoutes,
}) => {
  const {
    setPageActions,
    setPageActionRoutes,
    setHideActions,
    setTitle,
    setSubTitle,
    setDocumentTitle,
    setFilterMode,
    setShowFilters,
    journalTypes,
    setJournalTypes,
    searchText,
    setSearchText,
    setTabs,
  } = usePageContext();

  useEffect(() => {
    if (actions === undefined) {
      return;
    }

    setPageActions(actions);
  }, [setPageActions, actions]);

  useEffect(() => {
    if (pageActionRoutes === undefined) {
      return;
    }

    setPageActionRoutes(pageActionRoutes);
  }, [setPageActionRoutes, pageActionRoutes]);

  useEffect(() => setHideActions(hideActions), [hideActions, setHideActions]);

  useEffect(() => {
    if (tabs === undefined) {
      return;
    }

    setTabs(tabs);
  }, [setTabs, tabs]);

  useEffect(() => {
    if (title === undefined) {
      return;
    }

    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => setSubTitle(subTitle), [subTitle, setSubTitle]);

  useEffect(
    () => setDocumentTitle(documentTitle),
    [documentTitle, setDocumentTitle],
  );

  useEffect(() => setFilterMode(filterMode), [filterMode, setFilterMode]);

  useEffect(() => setShowFilters(showFilters), [showFilters, setShowFilters]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    return () => {
      if (showFilters) {
        setShowFilters(false);
      }

      if (filterMode !== FilterMode.None) {
        setFilterMode(FilterMode.None);
      }

      if (searchText) {
        setSearchText(null);
      }

      if (journalTypes?.length) {
        setJournalTypes([]);
      }

      if (tabs?.length) {
        setTabs([]);
      }

      if (Object.keys(searchParams ?? {}).length) {
        setSearchParams({});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <FadeInContainer testId={"page"}>{children}</FadeInContainer>;
};
