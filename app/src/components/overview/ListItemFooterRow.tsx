import React from "react";
import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { IAction } from "../common/actions/IAction";
import { Properties } from "../common/Properties";
import { ActionGroup } from "../common/actions/ActionGroup";
import { styled } from "@mui/material";

export const ListItemFooterRow: React.FC<{
  properties: IPropertyDefinition[];
  actions: IAction[];
}> = ({ properties, actions }) => {
  return (
    <PropertiesRow>
      <FlexGrow>
        <Properties properties={properties} />
      </FlexGrow>
      <ActionGroup actions={actions} />
    </PropertiesRow>
  );
};

const PropertiesRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: ${(p) => p.theme.spacing(2)};
  padding-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;

const FlexGrow = styled("div")`
  flex-grow: 1;
`;
