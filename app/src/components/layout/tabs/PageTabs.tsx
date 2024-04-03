import React from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import { IPageTab } from "./IPageTab";
import { engravedTheme } from "../../../theming/engravedTheme";

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
          component={Link}
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
