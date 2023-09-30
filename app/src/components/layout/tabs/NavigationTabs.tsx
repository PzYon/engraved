import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import { ITab } from "./ITab";
import { engravedTheme } from "../../../theming/engravedTheme";

export const NavigationTabs: React.FC<{
  tabs: ITab[];
  selectedKey?: string;
}> = ({ tabs, selectedKey }) => {
  const [value, setValue] = useState(selectedKey ?? tabs[0].key);

  return (
    <Tabs
      value={value}
      onChange={(_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          value={tab.key}
          label={tab.label}
          component={Link}
          to={tab.href}
          sx={{
            "&.MuiButtonBase-root.MuiTab-root": {
              color: engravedTheme.palette.primary.main + " !important",
            },
          }}
        />
      ))}
    </Tabs>
  );
};
