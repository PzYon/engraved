import React, { useEffect } from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { styled } from "@mui/material";
import { usePageContext } from "./PageContext";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  title: React.ReactNode;
  children: React.ReactNode;
}> = ({ actions, title, children }) => {
  const { setPageActions, setPageTitle } = usePageContext();

  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title]);

  useEffect(() => {
    setPageActions(actions);
    return () => setPageActions([]);
  }, [actions]);

  return <Host>{children}</Host>;
};

const Host = styled("section")``;
