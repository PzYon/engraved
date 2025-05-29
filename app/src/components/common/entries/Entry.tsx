import React from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { Link } from "react-router-dom";
import { getScheduleProperty } from "../../overview/scheduled/scheduleUtils";
import { IAction } from "../actions/IAction";
import { ListItemFooterRow } from "../../overview/ListItemFooterRow";
import { IconStyle } from "../IconStyle";
import { FormatDate } from "../FormatDate";
import { useAppContext } from "../../../AppContext";
import { EntrySubRoutes } from "./EntrySubRoutes";
import { IPropertyDefinition } from "../IPropertyDefinition";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalIcon } from "../../overview/journals/JournalIcon";

export type EntryPropsRenderStyle = "all" | "generic" | "none";

export const Entry: React.FC<{
  journal: IJournal;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
  propsRenderStyle: EntryPropsRenderStyle;
  hasFocus: boolean;
  propertyOverrides?: IPropertyDefinition[];
  noCompactFooter?: boolean;
}> = ({
  journal,
  entry,
  children,
  actions,
  propsRenderStyle,
  hasFocus,
  propertyOverrides,
  noCompactFooter,
}) => {
  const { user } = useAppContext();

  return (
    <>
      {children}
      <ListItemFooterRow
        hasFocus={hasFocus}
        properties={getEntryProperties(
          journal,
          entry,
          propsRenderStyle,
          user.id,
          propertyOverrides,
        )}
        actions={actions}
        noCompactFooter={noCompactFooter}
      />
      {hasFocus ? <EntrySubRoutes entry={entry} /> : null}
    </>
  );
};

function getEntryProperties(
  journal: IJournal,
  entry: IEntry,
  propsRenderStyle: EntryPropsRenderStyle,
  userId: string,
  propertyOverrides: IPropertyDefinition[],
) {
  const props = [
    {
      key: "journal-type",
      node: () => <JournalIcon journal={journal} iconStyle={IconStyle.Small} />,
      label: "",
      hideWhen: () => propsRenderStyle !== "all",
    },
    {
      key: "journal-name",
      node: () => (
        <Link to={`/journals/details/${journal.id}`}>{journal.name}</Link>
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
      const overrideIndex = propertyOverrides?.findIndex(
        (o) => o.key === currentValue.key,
      );

      previousValue.push(
        overrideIndex > -1 ? propertyOverrides[overrideIndex] : currentValue,
      );

      return previousValue;
    },
    [],
  );

  // add props from overrides that don't exist in initial set
  for (const prop of propertyOverrides ?? []) {
    if (!props.find((p) => p.key === prop.key)) {
      props.push(prop);
    }
  }

  return props;
}
