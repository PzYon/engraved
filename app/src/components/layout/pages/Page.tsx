import React, { useEffect } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  title: React.ReactNode;
  documentTitle?: string;
  enableSearch?: boolean;
  children: React.ReactNode;
}> = ({ actions, title, documentTitle, enableSearch, children }) => {
  const {
    setPageActions,
    setPageTitle,
    setDocumentTitle,
    setShowSearchBox,
    setSearchText,
  } = usePageContext();

  useEffect(() => {
    setPageTitle(title);
  }, [title]);

  useEffect(() => {
    setDocumentTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    setShowSearchBox(enableSearch);
  }, [enableSearch]);

  useEffect(() => {
    setPageActions(actions);
  }, [actions]);

  useEffect(() => {
    return () => setSearchText(null);
  }, []);

  return <FadeInContainer>{children}</FadeInContainer>;
};
