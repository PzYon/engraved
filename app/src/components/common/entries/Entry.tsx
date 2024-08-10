import React, { useEffect } from "react";
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
import { useSelectedItemId } from "../actions/searchParamHooks";

export type EntryPropsRenderStyle = "all" | "generic" | "none";

export const Entry: React.FC<{
  journal: IJournal;
  entry: IEntry;
  children: React.ReactNode;
  actions: IAction[];
  propsRenderStyle: EntryPropsRenderStyle;
  hasFocus: boolean;
  giveFocus?: () => void;
  propertyOverrides?: IPropertyDefinition[];
}> = ({
  journal,
  entry,
  children,
  actions,
  propsRenderStyle,
  hasFocus,
  giveFocus,
  propertyOverrides,
}) => {
  const { user } = useAppContext();

  const isActive = useSelectedItemId().getValue() === entry.id;

  useEffect(() => {
    if (isActive) {
      giveFocus?.();
    }
  }, [isActive, giveFocus]);

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
      />
      <EntrySubRoutes entry={entry} giveFocus={giveFocus} />
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
