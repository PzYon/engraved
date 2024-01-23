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
      <FooterContainer>
        <FlexGrow>
          <Properties
            properties={getEntryProperties(
              journalType,
              journalId,
              journalName,
              entry,
              propsRenderStyle,
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

const FooterContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
  margin-top: ${(p) => p.theme.spacing(1)};
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const FlexGrow = styled("div")`
  flex-grow: 1;
`;
