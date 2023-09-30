import React, { useEffect } from "react";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { ITab } from "../tabs/ITab";

export const Page: React.FC<{
  actions?: IAction[];
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  enableFilters?: boolean;
  tabs?: ITab[];
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
    setMetricTypes,
    setSearchText,
    setTabs,
  } = usePageContext();

  useEffect(() => {
    if (actions === undefined) {
      return;
    }

    setPageActions(actions);
  }, [actions]);

  useEffect(() => {
    if (tabs === undefined) {
      return;
    }

    setTabs(tabs);
  }, [tabs]);

  useEffect(() => {
    if (title === undefined) {
      return;
    }

    setTitle(title);
  }, [title]);

  useEffect(() => setSubTitle(subTitle), [subTitle]);

  useEffect(() => setDocumentTitle(documentTitle), [documentTitle]);

  useEffect(() => setEnableFilters(enableFilters), [enableFilters]);

  useEffect(() => {
    return () => {
      setShowFilters(false);
      setEnableFilters(false);
      setSearchText(null);
      setMetricTypes([]);
      setTabs([]);
    };
  }, []);

  return <FadeInContainer>{children}</FadeInContainer>;
};
