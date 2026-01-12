import React, { useRef } from "react";
import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { IAction } from "../common/actions/IAction";
import { Properties } from "../common/Properties";
import { ActionIconButtonGroup } from "../common/actions/ActionIconButtonGroup";
import { css, styled } from "@mui/material";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";
import { StickTo } from "../common/StickTo";

export const ListItemFooterRow: React.FC<{
  properties: IPropertyDefinition[];
  actions: IAction[];
  hasFocus: boolean;
  noCompactFooter?: boolean;
  isSticky?: boolean;
}> = ({ properties, actions, hasFocus, noCompactFooter, isSticky }) => {
  const { isCompact } = useDisplayModeContext();
  const stickyRef = useRef<HTMLDivElement>(null);

  if (isCompact && !hasFocus && !noCompactFooter) {
    return null;
  }

  return (
    <StickTo
      isDisabled={!isSticky}
      position={"bottom"}
      stickyRef={stickyRef}
      render={(isStuck) => (
        <PropertiesRow isStuck={isStuck} ref={stickyRef}>
          <FlexGrow>
            <Properties properties={properties} />
          </FlexGrow>
          <ActionContainer>
            <ActionIconButtonGroup actions={actions} />
          </ActionContainer>
        </PropertiesRow>
      )}
    />
  );
};

const PropertiesRow = styled("div")<{ isStuck: boolean }>`
  background-color: ${(p) => p.theme.palette.background.paper};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;
  margin-top: ${(p) => p.theme.spacing(2)};
  padding-top: ${(p) => p.theme.spacing(1)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};

  ${(p) =>
    p.isStuck
      ? css`
          padding-bottom: ${p.theme.spacing(2)};
        `
      : undefined}
`;

const FlexGrow = styled("div")`
  margin-top: ${(p) => p.theme.spacing(1)};
  flex-grow: 1;
`;

const ActionContainer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(1)};
  margin-left: ${(p) => p.theme.spacing(2)};
`;
