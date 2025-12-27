import { useAppContext } from "../../AppContext";
import { Properties } from "../common/Properties";
import { getScheduleProperty } from "./scheduled/scheduleUtils";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";
import { IEntity } from "../../serverApi/IEntity";
import React from "react";
import { ActionLink } from "../common/actions/ActionLink";
import { IAction } from "../common/actions/IAction";
import { styled } from "@mui/material";

export const ReadonlyTitle: React.FC<{
  title: React.ReactNode;
  hasFocus: boolean;
  entity: IEntity;
  onClickAction?: IAction;
}> = ({ title, hasFocus, entity, onClickAction }) => {
  const { user } = useAppContext();
  const { isCompact } = useDisplayModeContext();

  const inner = onClickAction ? (
    <ActionLink action={onClickAction}>
      <>{title}</>
    </ActionLink>
  ) : (
    <>{title}</>
  );

  return (
    <ReadonlyTitleContainer>
      <div style={{ flexGrow: 1 }}>{inner}</div>
      {!hasFocus && isCompact && entity ? (
        <Properties properties={[getScheduleProperty(entity, user.id)]} />
      ) : null}
    </ReadonlyTitleContainer>
  );
};

const ReadonlyTitleContainer = styled("div")`
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-family: ${(p) => p.theme.typography.fontFamily};
  color: ${(p) => p.theme.palette.primary.main};
  font-size: 1.8rem;
  font-weight: 200;
  line-height: 1.2;

  .ngrvd-emoji {
    font-size: 25px !important;
  }
`;
