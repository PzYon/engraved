import React, { useEffect } from "react";
import { useAppContext } from "../../AppContext";
import { IIconButtonAction } from "./IconButtonWrapper";
import { styled } from "@mui/material";

export const Page: React.FC<{
  actions: IIconButtonAction[];
  children: React.ReactNode;
}> = ({ actions, children }) => {
  const { setTitleActions } = useAppContext();

  useEffect(() => {
    setTitleActions(actions);
  }, [actions]);

  return <Host>{children}</Host>;
};

const Host = styled("section")``;
