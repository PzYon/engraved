import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { FormatDate } from "../FormatDate";
import { JournalTypeIcon } from "../JournalTypeIcon";
import { IconStyle } from "../Icon";
import { Link } from "react-router-dom";
import { getScheduleProperty } from "../../scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { FooterStuff } from "../FooterStuff";

export const Entry: React.FC<{
  journal: IJournal;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
}> = ({ journal, entry, children, actions }) => {
  return (
    <>
      {children}
      <FooterStuff
        actions={actions}
        properties={[
          {
            key: "journal-type",
            node: () => (
              <JournalTypeIcon type={journal.type} style={IconStyle.Overview} />
            ),
            label: "",
          },
          {
            key: "name",
            node: () => (
              <Link to={`/journals/${journal.id}`}>{journal.name}</Link>
            ),
            label: "Journal",
          },
          {
            key: "date",
            node: () => <FormatDate value={entry.editedOn || entry.dateTime} />,
            label: "Edited",
          },
          getScheduleProperty(entry.schedule?.nextOccurrence),
        ]}
      />
    </>
  );
};
