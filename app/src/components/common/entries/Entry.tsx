import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeIcon } from "../JournalTypeIcon";
import { Link } from "react-router-dom";
import { getScheduleProperty } from "../../scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { JournalType } from "../../../serverApi/JournalType";
import { ListItemFooterRow } from "../../overview/ListItemFooterRow";
import { IconStyle } from "../IconStyle";
import { FormatDate } from "../FormatDate";

export type EntryPropsRenderStyle = "all" | "generic" | "none";

export const Entry: React.FC<{
  journalType: JournalType;
  journalId: string;
  journalName: string;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
  propsRenderStyle: EntryPropsRenderStyle;
}> = ({
  journalType,
  journalId,
  journalName,
  entry,
  children,
  actions,
  propsRenderStyle,
}) => {
  return (
    <>
      {children}
      <ListItemFooterRow
        properties={getEntryProperties(
          journalType,
          journalId,
          journalName,
          entry,
          propsRenderStyle,
        )}
        actions={actions}
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
      node: () => <Link to={`/journals/${journalId}`}>{journalName}</Link>,
      label: "Journal",
      hideWhen: () => propsRenderStyle !== "all",
    },
    {
      key: "date",
      node: () => <FormatDate value={entry.editedOn || entry.dateTime} />,
      label: "Edited",
      hideWhen: () => propsRenderStyle === "none",
    },
    getScheduleProperty(entry.schedule?.nextOccurrence),
  ];
}
