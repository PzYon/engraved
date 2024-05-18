import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalTypeIcon } from "../JournalTypeIcon";
import { Link, Route, Routes } from "react-router-dom";
import { getScheduleProperty } from "../../overview/scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { JournalType } from "../../../serverApi/JournalType";
import { ListItemFooterRow } from "../../overview/ListItemFooterRow";
import { IconStyle } from "../IconStyle";
import { FormatDate } from "../FormatDate";
import { useAppContext } from "../../../AppContext";
import { EditSchedule } from "../../details/edit/EditSchedule";
import { DeleteEntry } from "../../details/edit/DeleteEntry";
import { NotificationDone } from "../../details/NotificationDone";
import { styled } from "@mui/material";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { MoveScrap } from "../../details/scraps/MoveScrap";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

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
      />
      <Routes>
        <Route
          path={`/${entry.id}/delete`}
          element={
            <NavigationActionContainer>
              <DeleteEntry entry={entry} closeDialog={() => {}} />
            </NavigationActionContainer>
          }
        />
        <Route
          path={`/${entry.id}/schedule`}
          element={
            <NavigationActionContainer>
              <EditSchedule
                journalId={""}
                entryId={entry.id}
                journal={null}
                onCancel={() => {}}
              />
            </NavigationActionContainer>
          }
        />
        <Route
          path={`/${entry.id}/notification-done`}
          element={
            <NavigationActionContainer>
              <NotificationDone
                entry={entry}
                journal={null}
                onSuccess={() => {}}
              />
            </NavigationActionContainer>
          }
        />
        <Route
          path={`/${entry.id}/move`}
          element={
            <NavigationActionContainer>
              <MoveScrap entry={entry as IScrapEntry} />
            </NavigationActionContainer>
          }
        />
      </Routes>
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
    getScheduleProperty(entry, userId),
  ];
}

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Host>
      <Inner>{children}</Inner>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  justify-content: end;
`;

const Inner = styled("div")`
  max-width: 500px;
  border: 2px solid ${(p) => p.theme.palette.background.default};
  border-radius: ${paperBorderRadius};
  padding: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
  width: 100%;
`;
