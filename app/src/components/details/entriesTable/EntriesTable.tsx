import React, { useEffect, useMemo, useState } from "react";
import { IEntry } from "../../../serverApi/IEntry";
import { translations } from "../../../i18n/translations";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { JournalType } from "../../../serverApi/JournalType";
import { ITimerEntry } from "../../../serverApi/ITimerEntry";
import { format } from "date-fns";
import { IJournalType } from "../../../journalTypes/IJournalType";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { EntriesDateTableCell } from "./EntriesDateTableCell";
import { EntriesTableBodyGroup } from "./EntriesTableBodyGroup";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { AddEntryTableRow } from "./addEntry/AddEntryTableRow";
import { AddEntryTableCell } from "./addEntry/AddEntryTableCell";
import { AddEntryTableSaveAction } from "./addEntry/AddEntryTableSaveAction";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { AggregationMode, FooterRowMode } from "../edit/IJournalUiSettings";
import { ActionIconButtonGroup } from "../../common/actions/ActionIconButtonGroup";
import { IDateConditions } from "../JournalContext";
import { TotalValue } from "./TotalValue";
import { Streak } from "./Streak";

export const EntriesTable: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  showGroupTotals: boolean;
  showAddNewEntryRow: boolean;
  aggregationMode: AggregationMode;
  setAggregationMode: (mode: AggregationMode) => void;
  dateConditions: IDateConditions;
  footerRowMode?: FooterRowMode;
}> = ({
  journal,
  entries,
  showGroupTotals,
  showAddNewEntryRow,
  aggregationMode,
  setAggregationMode,
  dateConditions,
  footerRowMode,
}) => {
  const type = useMemo(
    () => JournalTypeFactory.create(journal.type),
    [journal?.type],
  );

  const [collapseAll, setCollapseAll] = useState<boolean>(true);

  const columns = useMemo<IEntriesTableColumnDefinition[]>(() => {
    return [
      ...getColumnsBefore(journal, collapseAll, () =>
        setCollapseAll(!collapseAll),
      ),
      ...type.getEntriesTableColumns(),
      ...getColumnsAfter(journal),
    ].filter((c) => c.doHide?.(journal) !== true);
  }, [journal, collapseAll, type]);

  const [tableGroups, setTableGroups] = useState<IEntriesTableGroup[]>([]);

  const deviceWidth = useDeviceWidth();

  useEffect(() => {
    updateGroups();

    const interval =
      type.type === JournalType.Timer
        ? window.setInterval(updateGroups, 10000)
        : null;

    return () => window.clearInterval(interval);

    function updateGroups() {
      setTableGroups(getEntriesTableGroups(entries, type));
    }
  }, [journal, entries, type]);

  if (!tableGroups.length) {
    return null;
  }

  const headerFooterRow =
    entries.length &&
    columns.filter((column) => column.isAggregatable).length ? (
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.key}>
            {column.key === "_date" ? (
              <Streak journal={journal} entries={entries} />
            ) : null}
            {column.isAggregatable ? (
              <TotalValue
                journalType={type}
                tableGroups={tableGroups}
                aggregationMode={aggregationMode}
                setAggregationMode={setAggregationMode}
                dateConditions={dateConditions}
              />
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    ) : null;

  return (
    <StyledTable
      data-testid="entries-table"
      sx={{
        tableLayout: deviceWidth === DeviceWidth.Small ? undefined : "fixed",
      }}
    >
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableCell
              key={c.key}
              sx={{
                width: c.width,
                minWidth: c.minWidth,
                maxWidth: c.maxWidth,
              }}
              className={c.className}
            >
              {c.getHeaderReactNode(
                () => setCollapseAll(!collapseAll),
                journal,
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {footerRowMode !== "bottom" ? headerFooterRow : null}
        {showAddNewEntryRow ? (
          <AddEntryTableRow columns={columns} journal={journal} />
        ) : null}
        {tableGroups.map((group, i) => (
          <EntriesTableBodyGroup
            key={group.label}
            group={group}
            columns={columns}
            showGroupTotals={showGroupTotals}
            isGroupCollapsed={
              (collapseAll === undefined ? true : collapseAll) && i !== 0
            }
          />
        ))}
      </TableBody>
      {footerRowMode !== "top" ? (
        <TableFooter>{headerFooterRow}</TableFooter>
      ) : null}
    </StyledTable>
  );
};

const StyledTable = styled(Table)`
  th {
    border-bottom: 1px solid ${(p) => p.theme.palette.background.default};
  }

  td {
    border-top: 1px solid ${(p) => p.theme.palette.background.default};
    border-bottom: 0;

    &.action-cell {
      vertical-align: bottom;
    }
  }

  td,
  th {
    padding: ${(p) => p.theme.spacing(1.5)};
  }

  th:last-of-type,
  td:last-of-type,
  th:first-of-type,
  td:first-of-type {
    padding-left: 0;
    padding-right: 0;
  }

  tr.action-row {
    td {
      border-top: 0;
      padding-top: 0;
    }

    .action-container {
      margin-top: 0;
    }
  }
`;

function getColumnsBefore(
  journal: IJournal,
  collapseAll: boolean,
  onHeaderClick: () => void,
): IEntriesTableColumnDefinition[] {
  return [
    {
      key: "_collapse",
      width: "40px",
      getHeaderReactNode: () =>
        collapseAll ? (
          <ActionIconButton action={ActionFactory.collapse(onHeaderClick)} />
        ) : (
          <ActionIconButton action={ActionFactory.expand(onHeaderClick)} />
        ),
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
      key: "_date",
      maxWidth: "300px",
      getHeaderReactNode: () => translations.columnName_date,
      getGroupReactNode: (group) => (
        <EntriesDateTableCell date={new Date(group.label)} />
      ),
      getValueReactNode: (_, entry, isFirstRowOfGroup) =>
        isFirstRowOfGroup ? (
          <EntriesDateTableCell date={entry.dateTime} />
        ) : null,
      getGroupKey: (entry) => getGroupKey(journal.type, entry),
      getAddEntryReactNode: (command, updateCommand) => {
        return (
          <AddEntryTableCell
            journal={journal}
            command={command}
            updateCommand={updateCommand}
            fieldType={"date"}
            fieldName={"dateTime"}
            hasFocus={true}
          />
        );
      },
    },
  ];
}

function getColumnsAfter(journal: IJournal): IEntriesTableColumnDefinition[] {
  return [
    {
      key: "_attributes",
      minWidth: "140px",
      getHeaderReactNode: () => translations.columnName_attributes,
      doHide: (journal: IJournal): boolean =>
        !Object.keys(journal.attributes ?? {}).length,
      getValueReactNode: (_, entry) => (
        <AttributeValues
          attributes={journal.attributes}
          attributeValues={entry.journalAttributeValues}
        />
      ),
      getAddEntryReactNode: (command, updateCommand) => {
        return (
          <AddEntryTableCell
            journal={journal}
            command={command}
            updateCommand={updateCommand}
            fieldType="attributes"
            fieldName="journalAttributeValues"
          />
        );
      },
    },
    {
      key: "_notes",
      getHeaderReactNode: () => translations.columnName_notes,
      getValueReactNode: (_, entry) => entry.notes,
      getAddEntryReactNode: (command, updateCommand) => {
        return (
          <AddEntryTableCell
            journal={journal}
            command={command}
            updateCommand={updateCommand}
            fieldType={"text"}
            fieldName={"notes"}
          />
        );
      },
    },
    {
      key: "_actions",
      width: "80px",
      className: "action-cell",
      getHeaderReactNode: () => translations.columnName_actions,
      getValueReactNode: (_, entry) => (
        <ActionIconButtonGroup
          actions={[
            ActionFactory.editEntry(entry),
            ActionFactory.deleteEntry(entry),
          ]}
        />
      ),
      getAddEntryReactNode: (command, updateCommand) => {
        return (
          <AddEntryTableSaveAction
            command={command}
            journal={journal}
            onAdded={(lastSelectedDate) => {
              updateCommand(
                {
                  journalId: command.journalId,
                  value: undefined,
                  dateTime: lastSelectedDate
                    ? new Date(lastSelectedDate)
                    : new Date(),
                  journalAttributeValues: {},
                },
                true,
              );
            }}
          />
        );
      },
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
