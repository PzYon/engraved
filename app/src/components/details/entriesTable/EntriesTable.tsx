import React, { useEffect, useMemo, useState } from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { translations } from "../../../i18n/translations";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { EntryActionButtons } from "./EntryActionButtons";
import { JournalType } from "../../../serverApi/JournalType";
import { ITimerEntry } from "../../../serverApi/ITimerEntry";
import { format } from "date-fns";
import { IJournalType } from "../../../journalTypes/IJournalType";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { EntriesDateTableCell } from "./EntriesDateTableCell";
import { EntriesTableBodyGroup } from "./EntriesTableBodyGroup";
import { ActionFactory } from "../../common/actions/ActionFactory";

export const EntriesTable: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  showGroupTotals: boolean;
}> = ({ journal, entries, showGroupTotals }) => {
  const type = useMemo(
    () => JournalTypeFactory.create(journal.type),
    [journal?.type],
  );

  const [collapseAll, setCollapseAll] = useState<boolean>(undefined);

  const columns = useMemo(() => {
    return [
      ...getColumnsBefore(journal, collapseAll, () =>
        setCollapseAll(!collapseAll),
      ),
      ...type.getEntriesTableColumns(),
      ...getColumnsAfter(journal),
    ].filter((c) => c.doHide?.(journal) !== true);
  }, [journal, collapseAll, type]);

  const [tableGroups, setTableGroups] = useState<IEntriesTableGroup[]>([]);

  useEffect(() => {
    updateGroups();

    const interval =
      type.type === JournalType.Timer ? setInterval(updateGroups, 10000) : null;

    return () => clearInterval(interval);

    function updateGroups() {
      setTableGroups(getEntriesTableGroups(entries, type));
    }
  }, [journal, entries, type]);

  return (
    <Table data-testid="entries-table">
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableCell
              key={c.key}
              sx={c.width ? { width: c.width } : undefined}
            >
              {c.getHeaderReactNode(() => setCollapseAll(!collapseAll))}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableGroups.map((group, i) => (
          <EntriesTableBodyGroup
            key={group.label}
            group={group}
            columns={columns}
            showGroupTotals={showGroupTotals}
            isGroupCollapsed={
              collapseAll === undefined && i !== 0 ? true : collapseAll
            }
          />
        ))}
      </TableBody>
      {entries.length && columns.filter((c) => c.isSummable).length ? (
        <TableFooter>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {getTotalValue(c, tableGroups, type)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
};

function getColumnsBefore(
  journal: IJournal,
  collapseAll: boolean,
  onHeaderClick: () => void,
): IEntriesTableColumnDefinition[] {
  return [
    {
      getHeaderReactNode: () =>
        collapseAll ? (
          <ActionIconButton action={ActionFactory.expand(onHeaderClick)} />
        ) : (
          <ActionIconButton action={ActionFactory.expand(onHeaderClick)} />
        ),
      key: "_collapse",
      width: "40px",
      getValueReactNode: (group, _, isFirstRowOfGroup, onClick) => {
        if (!isFirstRowOfGroup || group.entries.length < 2) {
          return null;
        }

        return <ActionIconButton action={ActionFactory.expand(onClick)} />;
      },
      getGroupReactNode: (_, onClick) => {
        return <ActionIconButton action={ActionFactory.collapse(onClick)} />;
      },
    },
    {
      getHeaderReactNode: () => translations.columnName_date,
      key: "_date",
      getGroupReactNode: (group) => (
        <EntriesDateTableCell date={new Date(group.label)} />
      ),
      getValueReactNode: (_, entry, isFirstRowOfGroup) =>
        isFirstRowOfGroup ? (
          <EntriesDateTableCell date={entry.dateTime} />
        ) : null,
      getGroupKey: (entry) => getGroupKey(journal.type, entry),
    },
  ];
}

function getColumnsAfter(journal: IJournal): IEntriesTableColumnDefinition[] {
  return [
    {
      getHeaderReactNode: () => translations.columnName_attributes,
      key: "_attributes",
      doHide: (journal: IJournal): boolean =>
        !Object.keys(journal.attributes ?? {}).length,
      getValueReactNode: (_, entry) => (
        <AttributeValues
          attributes={journal.attributes}
          attributeValues={entry.journalAttributeValues}
        />
      ),
    },
    {
      getHeaderReactNode: () => translations.columnName_notes,
      key: "_notes",
      getValueReactNode: (_, entry) => entry.notes,
    },
    {
      getHeaderReactNode: () => translations.columnName_actions,
      key: "_actions",
      width: "80px",
      getValueReactNode: (_, entry) => <EntryActionButtons entry={entry} />,
    },
  ];
}

function getEntriesTableGroups(
  entries: IEntry[],
  type: IJournalType,
): IEntriesTableGroup[] {
  const groupsByKey: Record<string, IEntriesTableGroup> = {};

  for (const entry of entries) {
    const groupKey = getGroupKey(type.type, entry);

    if (!groupsByKey[groupKey]) {
      groupsByKey[groupKey] = {
        label: groupKey,
        entries: [],
        totalValue: 0,
        totalString: "0",
      };
    }

    groupsByKey[groupKey].entries.push(entry);

    const total = groupsByKey[groupKey].totalValue + type.getValue(entry);

    groupsByKey[groupKey].totalValue = total;
    groupsByKey[groupKey].totalString = type.formatTotalValue
      ? type.formatTotalValue(total)
      : total.toString();
  }

  return Object.values(groupsByKey);
}

function getGroupKey(journalType: JournalType, entry: IEntry) {
  const relevantDate =
    journalType === JournalType.Timer
      ? (entry as ITimerEntry).startDate
      : entry.dateTime;

  return format(new Date(relevantDate), "u-LL-dd");
}

function getTotalValue(
  columnDefinition: IEntriesTableColumnDefinition,
  tableGroups: IEntriesTableGroup[],
  type: IJournalType,
) {
  if (!columnDefinition.isSummable) {
    return null;
  }

  const totalValue = tableGroups
    .map((g) => g.totalValue)
    .reduce((total, current) => total + current, 0);

  return type.formatTotalValue?.(totalValue) ?? totalValue;
}
