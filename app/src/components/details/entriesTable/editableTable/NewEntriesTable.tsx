import { IJournal } from "../../../../serverApi/IJournal";
import { IEntry } from "../../../../serverApi/IEntry";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { IGaugeEntry } from "../../../../serverApi/IGaugeEntry";
import { DateSelector } from "../../../common/DateSelector";
import { IEntriesTableColumnDefinition } from "../IEntriesTableColumnDefinition";

export const NewEntriesTable: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  showGroupTotals: boolean;
  columns: IEntriesTableColumnDefinition[];
}> = ({ entries, columns }) => {
  return (
    <Table>
      <TableBody>
        {entries.map((e) => (
          <NewEntriesTableRow
            key={e.id}
            entry={e as IGaugeEntry}
            columns={columns}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export const NewEntriesTableRow: React.FC<{
  entry: IGaugeEntry;
  columns: IEntriesTableColumnDefinition[];
}> = ({ columns }) => {
  const [newEntry, setNewEntry] = useState<IEntry>({} as unknown as IEntry);

  return (
    <TableRow>
      {columns.map((c) => (
        <TableCell key={c.key}>
          {c.getEditModeReactNode?.(newEntry, setNewEntry) ?? <></>}
        </TableCell>
      ))}
    </TableRow>
  );
  /*
              return (
                <TableRow>
                  <TableCell />
                  <NewEntriesTableCell
                    value={entry.dateTime}
                    type={"date"}
                    setValue={(value) => alert("dateTime changed: " + value)}
                  />
                  <NewEntriesTableCell
                    value={entry.value?.toString() ?? ""}
                    type={"number"}
                    setValue={(value) => alert("value changed: " + value)}
                  />
                  <NewEntriesTableCell
                    value={"attributes"}
                    type={"text"}
                    setValue={() => alert("attributes!")}
                  />
                  <NewEntriesTableCell
                    value={entry.notes}
                    type={"text"}
                    setValue={(value) => alert("notes changed: " + value)}
                  />
                  <TableCell />
                </TableRow>
              );
             */
};

export const NewEntriesTableCell: React.FC<{
  value: string;
  setValue: (value: string) => void;
  type: "text" | "number" | "date";
}> = ({ value, setValue, type = "text" }) => {
  if (type === "date") {
    return (
      <TableCell>
        <DateSelector
          setDate={(d) => {
            setValue(d.toString());
          }}
          date={new Date(value)}
        />
      </TableCell>
    );
  }

  return (
    <TableCell>
      <TextField
        value={value}
        type={type === "number" ? "number" : undefined}
        onChange={(event) => setValue(event.target.value)}
        label={"Value"}
        margin={"dense"}
        sx={{
          marginBottom: "0",
        }}
      />
    </TableCell>
  );
};
