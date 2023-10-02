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
  }, [journal, collapseAll]);

  const [tableGroups, setTableGroups] = useState<IEntriesTableGroup[]>([]);

  useEffect(() => {
    updateGroups();

    const interval =
      type.type === JournalType.Timer ? setInterval(updateGroups, 10000) : null;

    return () => clearInterval(interval);
  }, [journal, entries]);

  return (
    <Table>
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

  function updateGroups() {
    setTableGroups(getMeasurementsTableGroups(entries, type));
  }
};

function getColumnsBefore(
  metric: IJournal,
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
      getValueReactNode: (_, measurement, isFirstRowOfGroup) =>
        isFirstRowOfGroup ? (
          <EntriesDateTableCell date={measurement.dateTime} />
        ) : null,
      getGroupKey: (measurement) => getGroupKey(metric.type, measurement),
    },
  ];
}

function getColumnsAfter(metric: IJournal): IEntriesTableColumnDefinition[] {
  return [
    {
      getHeaderReactNode: () => translations.columnName_attributes,
      key: "_attributes",
      doHide: (metric: IJournal): boolean =>
        !Object.keys(metric.attributes ?? {}).length,
      getValueReactNode: (_, measurement) => (
        <AttributeValues
          attributes={metric.attributes}
          attributeValues={measurement.journalAttributeValues}
        />
      ),
    },
    {
      getHeaderReactNode: () => translations.columnName_notes,
      key: "_notes",
      getValueReactNode: (_, measurement) => measurement.notes,
    },
    {
      getHeaderReactNode: () => translations.columnName_actions,
      key: "_actions",
      width: "80px",
      getValueReactNode: (_, measurement) => (
        <EntryActionButtons entry={measurement} />
      ),
    },
  ];
}

function getMeasurementsTableGroups(
  measurements: IEntry[],
  type: IJournalType,
): IEntriesTableGroup[] {
  const groupsByKey: Record<string, IEntriesTableGroup> = {};

  for (const measurement of measurements) {
    const groupKey = getGroupKey(type.type, measurement);

    if (!groupsByKey[groupKey]) {
      groupsByKey[groupKey] = {
        label: groupKey,
        entries: [],
        totalValue: 0,
        totalString: "0",
      };
    }

    groupsByKey[groupKey].entries.push(measurement);

    const total = groupsByKey[groupKey].totalValue + type.getValue(measurement);

    groupsByKey[groupKey].totalValue = total;
    groupsByKey[groupKey].totalString = type.formatTotalValue
      ? type.formatTotalValue(total)
      : total.toString();
  }

  return Object.values(groupsByKey);
}

function getGroupKey(metricType: JournalType, measurement: IEntry) {
  const relevantDate =
    metricType === JournalType.Timer
      ? (measurement as ITimerEntry).startDate
      : measurement.dateTime;

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
