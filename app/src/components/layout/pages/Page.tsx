import React, { useEffect } from "react";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";

export const Page: React.FC<{
  actions?: IAction[];
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  enableFilters?: boolean;
  tabs?: IPageTab[];
  children: React.ReactNode;
}> = ({
  actions,
  title,
  subTitle,
  documentTitle,
  enableFilters,
  tabs,
  children,
}) => {
  const {
    setPageActions,
    setTitle,
    setSubTitle,
    setDocumentTitle,
    setEnableFilters,
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

  useEffect(
    () => setEnableFilters(enableFilters),
    [enableFilters, setEnableFilters],
  );

  useEffect(() => {
    return () => {
      setShowFilters(false);
      setEnableFilters(false);
      setSearchText(null);
      setJournalTypes([]);
      setTabs([]);
    };
  }, [
    setEnableFilters,
    setJournalTypes,
    setSearchText,
    setShowFilters,
    setTabs,
  ]);

  return <FadeInContainer>{children}</FadeInContainer>;
};
