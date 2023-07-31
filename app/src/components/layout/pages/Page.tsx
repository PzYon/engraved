import React, { useEffect } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";

export const Page: React.FC<{
  actions?: IIconButtonAction[];
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  enableFilters?: boolean;
  children: React.ReactNode;
}> = ({ actions, title, subTitle, documentTitle, enableFilters, children }) => {
  const {
    setPageActions,
    setTitle,
    setSubTitle,
    setDocumentTitle,
    setEnableFilters,
    setShowFilters,
    setMetricTypes,
    setSearchText,
  } = usePageContext();

  useEffect(() => {
    if (title === undefined) {
      return;
    }

    setTitle(title);
  }, [title]);

  useEffect(() => {
    setSubTitle(subTitle);
  }, [subTitle]);

  useEffect(() => {
    setDocumentTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    setEnableFilters(enableFilters);
  }, [enableFilters]);

  useEffect(() => {
    if (actions === undefined) {
      return;
    }

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
