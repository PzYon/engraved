import React, { useEffect } from "react";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";

export const pageTabs: ITab[] = [
  {
    key: "metrics",
    href: "/metrics",
    label: "Metrics",
  },
  { key: "measurements", href: "/users/me", label: "Measurements" },
];

export interface ITab {
  key: string;
  label: string;
  href: string;
}

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
    };
  }, []);

  return <FadeInContainer>{children}</FadeInContainer>;
};
