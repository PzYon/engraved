import React, { useEffect } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  title: React.ReactNode;
  documentTitle?: string;
  enableFilters?: boolean;
  children: React.ReactNode;
}> = ({ actions, title, documentTitle, enableFilters, children }) => {
  const {
    setPageActions,
    setPageTitle,
    setDocumentTitle,
    setEnableFilters,
    setShowFilters,
    setMetricTypes,
    setSearchText,
  } = usePageContext();

  useEffect(() => {
    setPageTitle(title);
  }, [title]);

  useEffect(() => {
    setDocumentTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    setEnableFilters(enableFilters);
  }, [enableFilters]);

  useEffect(() => {
    setPageActions(actions);
  }, [actions]);

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
