import React from "react";
import { Link } from "@tanstack/react-router";
import { Tab, Tabs } from "@mui/material";
import { IPageTab } from "./IPageTab";
import { engravedTheme } from "../../../theming/engravedTheme";

// MUI's `component` prop doesn't thread through TanStack Router's typed `to`
// union, so we cast Link to a plain React element type here.
const LinkElement = Link as React.ElementType;

export const PageTabs: React.FC<{
  tabs: IPageTab[];
}> = ({ tabs }) => {
  if (!tabs?.length) {
    return null;
  }

  return (
    <Tabs value={tabs.find((t) => t.isSelected)?.key}>
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          value={tab.key}
          label={tab.label}
          component={LinkElement}
          to={tab.href}
          sx={{
            minHeight: "auto",
            "&.MuiButtonBase-root.MuiTab-root": {
              color: engravedTheme.palette.primary.main + " !important",
            },
            ".MuiTab-iconWrapper": {
              marginBottom: "0 !important",
            },
            display: "flex",
            flexDirection: "row",
          }}
        />
      ))}
    </Tabs>
  );
};
