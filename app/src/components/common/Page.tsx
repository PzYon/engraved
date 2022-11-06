import React, { useEffect } from "react";
import { useAppContext } from "../../AppContext";
import { IIconButtonAction } from "./IconButtonWrapper";
import { styled } from "@mui/material";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  title: React.ReactNode;
  children: React.ReactNode;
}> = ({ actions, title, children }) => {
  const { setTitleActions, setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title]);

  useEffect(() => {
    setTitleActions(actions);
    return () => setTitleActions([]);
  }, [actions]);

  return <Host>{children}</Host>;
};

const Host = styled("section")``;
