import React, { useEffect } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  title: React.ReactNode;
  documentTitle?: string;
  children: React.ReactNode;
}> = ({ actions, title, documentTitle, children }) => {
  const { setPageActions, setPageTitle, setDocumentTitle } = usePageContext();

  useEffect(() => {
    setPageTitle(title);
    setDocumentTitle(documentTitle);
    return () => setPageTitle(null);
  }, [title]);

  useEffect(() => {
    setPageActions(actions);
    return () => setPageActions([]);
  }, [actions]);

  return <FadeInContainer>{children}</FadeInContainer>;
};
