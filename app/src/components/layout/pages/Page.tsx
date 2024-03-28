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
}) => {
  const {
    setPageActions,
    setHideActions,
    setTitle,
    setSubTitle,
    setDocumentTitle,
    setFilterMode,
    setShowFilters,
    setJournalTypes,
    setSearchText,
    setTabs,
  } = usePageContext();

  useEffect(() => {
    if (actions === undefined) {
      return;
    }

    setPageActions(actions);
  }, [setPageActions, actions]);

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

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    return () => {
      setShowFilters(false);
      setFilterMode(FilterMode.None);
      setSearchText(null);
      setJournalTypes([]);
      setTabs([]);
      setSearchParams({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <FadeInContainer>{children}</FadeInContainer>;
};
