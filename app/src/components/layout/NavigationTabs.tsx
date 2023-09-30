import React, { useState } from "react";
import { ITab } from "./pages/Page";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";

export const NavigationTabs: React.FC<{
  tabs: ITab[];
  selectedKey?: string;
}> = ({ tabs, selectedKey }) => {
  const navigate = useNavigate();

  const [value, setValue] = useState(selectedKey ?? tabs[0].key);

  return (
    <Tabs
      value={value}
      onChange={(_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      }}
    >
      {tabs.map((tab) => {
        return (
          <Tab
            key={tab.key}
            value={tab.key}
            label={tab.label}
            onClick={() => {
              navigate(tab.href);
            }}
          ></Tab>
        );
      })}
    </Tabs>
  );
};
