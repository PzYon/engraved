import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeIcon } from "../JournalTypeIcon";
import { Link } from "react-router-dom";
import { getScheduleProperty } from "../../overview/scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { JournalType } from "../../../serverApi/JournalType";
import { ListItemFooterRow } from "../../overview/ListItemFooterRow";
import { IconStyle } from "../IconStyle";
import { FormatDate } from "../FormatDate";
import { useAppContext } from "../../../AppContext";
import { styled } from "@mui/material";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { EntrySubRoutes } from "./EntrySubRoutes";

export type EntryPropsRenderStyle = "all" | "generic" | "none";

export const Entry: React.FC<{
  journalType: JournalType;
  journalId: string;
  journalName: string;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
  propsRenderStyle: EntryPropsRenderStyle;
  hasFocus: boolean;
}> = ({
  journalType,
  journalId,
  journalName,
  entry,
  children,
  actions,
  propsRenderStyle,
  hasFocus,
}) => {
  const { user } = useAppContext();

  return (
    <>
      {children}
      <ListItemFooterRow
        hasFocus={hasFocus}
        properties={getEntryProperties(
          journalType,
          journalId,
          journalName,
          entry,
          propsRenderStyle,
          user.id,
        )}
        actions={actions}
        actionRoutes={<EntrySubRoutes entry={entry} />}
      />
    </>
  );
};

function getEntryProperties(
  journalType: JournalType,
  journalId: string,
  journalName: string,
  entry: IEntry,
  propsRenderStyle: EntryPropsRenderStyle,
  userId: string,
) {
  return [
    {
      key: "journal-type",
      node: () => (
        <JournalTypeIcon type={journalType} style={IconStyle.Overview} />
      ),
      label: "",
      hideWhen: () => propsRenderStyle !== "all",
    },
    {
      key: "journal-name",
      node: () => (
        <Link to={`/journals/details/${journalId}`}>{journalName}</Link>
      ),
      label: "Journal",
      hideWhen: () => propsRenderStyle !== "all",
    },
    {
      key: "date",
      node: () => <FormatDate value={entry.editedOn || entry.dateTime} />,
      label: "Edited",
      hideWhen: () => propsRenderStyle === "none",
    },
    getScheduleProperty(entry, userId),
  ];
}

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
  shrinkWidthIfPossible?: boolean;
}> = ({ children, shrinkWidthIfPossible }) => {
  return (
    <Host>
      <Inner style={{ width: shrinkWidthIfPossible ? "auto" : "100%" }}>
        {children}
      </Inner>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  justify-content: end;
`;

const Inner = styled("div")`
  background-color: ${(p) => p.theme.palette.common.white};
  max-width: 500px;
  border: 4px solid ${(p) => p.theme.palette.background.default};
  border-radius: ${paperBorderRadius};
  padding: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
  width: 100%;
`;
