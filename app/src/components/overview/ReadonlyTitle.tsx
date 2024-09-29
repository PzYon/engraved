import { useAppContext } from "../../AppContext";
import { Properties } from "../common/Properties";
import { getScheduleProperty } from "./scheduled/scheduleUtils";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";
import { IEntity } from "../../serverApi/IEntity";
import React from "react";
import { ActionLink } from "../common/actions/ActionLink";
import { IAction } from "../common/actions/IAction";
import { styled, Typography } from "@mui/material";

export const ReadonlyTitle: React.FC<{
  title: React.ReactNode;
  hasFocus: boolean;
  entity: IEntity;
  onClick?: IAction;
}> = ({ title, hasFocus, entity, onClick }) => {
  const { user } = useAppContext();
  const { isCompact } = useDisplayModeContext();

  return (
    <ReadonlyTitleContainer>
      <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
        {getTitle()}
        {!hasFocus && isCompact && entity ? (
          <Properties properties={[getScheduleProperty(entity, user.id)]} />
        ) : null}
      </span>
    </ReadonlyTitleContainer>
  );

  function getTitle() {
    const inner = onClick ? (
      <ActionLink action={onClick}>
        <>{title}</>
      </ActionLink>
    ) : (
      <>{title}</>
    );

    return <span style={{ flexGrow: 1 }}>{inner}</span>;
  }
};

const ReadonlyTitleContainer = styled(Typography)`
  color: ${(p) => p.theme.palette.primary.main};
  font-size: 2rem;
  font-weight: 200;
  line-height: 1;
  flex-grow: 1;
`;
