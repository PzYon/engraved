import React from "react";
import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { IAction } from "../common/actions/IAction";
import { Properties } from "../common/Properties";
import { ActionIconButtonGroup } from "../common/actions/ActionIconButtonGroup";
import { styled } from "@mui/material";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";

export const ListItemFooterRow: React.FC<{
  properties: IPropertyDefinition[];
  actions: IAction[];
  hasFocus: boolean;
}> = ({ properties, actions, hasFocus }) => {
  const { isCompact } = useDisplayModeContext();

  if (isCompact && !hasFocus) {
    return null;
  }

  return (
    <PropertiesRow>
      <FlexGrow>
        <Properties properties={properties} />
      </FlexGrow>
      <ActionContainer>
        <ActionIconButtonGroup actions={actions} />
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
  padding-top: ${(p) => p.theme.spacing(1)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;

const FlexGrow = styled("div")`
  margin-top: ${(p) => p.theme.spacing(1)};
  flex-grow: 1;
`;

const ActionContainer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(1)};
  margin-left: ${(p) => p.theme.spacing(2)};
`;
