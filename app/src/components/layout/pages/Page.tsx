import React, { useEffect } from "react";
import { FilterMode, usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";

export const Page: React.FC<{
  actions?: IAction[];
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  tabs?: IPageTab[];
  children: React.ReactNode;
  filterMode?: FilterMode;
}> = ({
  actions,
  title,
  subTitle,
  documentTitle,
  tabs,
  children,
  filterMode = "none",
}) => {
  const {
    setPageActions,
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

  useEffect(() => {
    return () => {
      setShowFilters(false);
      setFilterMode("none");
      setSearchText(null);
      setJournalTypes([]);
      setTabs([]);
    };
  }, [setFilterMode, setJournalTypes, setSearchText, setShowFilters, setTabs]);

  return <FadeInContainer>{children}</FadeInContainer>;
};
