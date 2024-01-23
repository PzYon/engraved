import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { FormatDate } from "../FormatDate";
import { JournalTypeIcon } from "../JournalTypeIcon";
import { IconStyle } from "../Icon";
import { Link } from "react-router-dom";
import { getScheduleProperty } from "../../scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { styled } from "@mui/material";
import { JournalType } from "../../../serverApi/JournalType";
import { Properties } from "../Properties";
import { ActionGroup } from "../actions/ActionGroup";

export const Entry: React.FC<{
  journalType: JournalType;
  journalId: string;
  journalName: string;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
}> = ({ journalType, journalId, journalName, entry, children, actions }) => {
  return (
    <>
      {children}
      <FooterContainer>
        <FlexGrow>
          <Properties
            properties={getEntryProperties(
              journalType,
              journalId,
              journalName,
              entry,
            )}
          ></Properties>
        </FlexGrow>
        <ActionGroup actions={actions} />
      </FooterContainer>
    </>
  );
};

function getEntryProperties(
  journalType: JournalType,
  journalId: string,
  journalName: string,
  entry: IEntry,
) {
  return [
    {
      key: "journal-type",
      node: () => (
        <JournalTypeIcon type={journalType} style={IconStyle.Overview} />
      ),
      label: "",
    },
    {
      key: "name",
      node: () => <Link to={`/journals/${journalId}`}>{journalName}</Link>,
      label: "Journal",
    },
    {
      key: "date",
      node: () => <FormatDate value={entry.editedOn || entry.dateTime} />,
      label: "Edited",
    },
    getScheduleProperty(entry.schedule?.nextOccurrence),
  ];
}

const FooterContainer = styled("div")`
  display: flex;
  flex-direction: row;
  border-top: 1px solid #d4e3eb;
  margin-top: ${(p) => p.theme.spacing(1)};
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const FlexGrow = styled("div")`
  flex-grow: 1;
`;
