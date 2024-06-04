import React, { useEffect } from "react";
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
import { IPropertyDefinition } from "../IPropertyDefinition";

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
  giveFocus?: () => void;
  propertyOverrides?: IPropertyDefinition[];
}> = ({
  journalType,
  journalId,
  journalName,
  entry,
  children,
  actions,
  propsRenderStyle,
  hasFocus,
  giveFocus,
  propertyOverrides,
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
          propertyOverrides,
        )}
        actions={actions}
      />
      <EntrySubRoutes entry={entry} giveFocus={giveFocus} />
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
  propertyOverrides: IPropertyDefinition[],
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
  ].reduce(
    (
      previousValue: IPropertyDefinition[],
      currentValue: IPropertyDefinition,
    ) => {
      const overrideIndex = propertyOverrides.findIndex(
        (o) => o.key === currentValue.key,
      );

      previousValue.push(
        overrideIndex > -1 ? propertyOverrides[overrideIndex] : currentValue,
      );

      return previousValue;
    },
    [],
  );
}

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
  shrinkWidthIfPossible?: boolean;
  giveFocus?: () => void;
}> = ({ children, shrinkWidthIfPossible, giveFocus }) => {
  useEffect(() => {
    giveFocus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
