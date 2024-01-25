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
      <ActionContainer>
        <ActionGroup actions={actions} />
      </ActionContainer>
    </PropertiesRow>
  );
};

const PropertiesRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;
  margin-top: ${(p) => p.theme.spacing(2)};
  padding-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;

const FlexGrow = styled("div")`
  flex-grow: 1;
`;

const ActionContainer = styled("div")`
  margin-left: ${(p) => p.theme.spacing(2)};
`;
