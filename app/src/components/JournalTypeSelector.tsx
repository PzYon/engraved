import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { JournalType } from "../serverApi/JournalType";
import { translations } from "../i18n/translations";
import { JournalTypeMenuItem } from "./JournalTypeMenuItem";

export const JournalTypeSelector: React.FC<{
  journalType: JournalType | JournalType[];
  onChange: (journalType: JournalType | JournalType[]) => void;
  allowMultiple?: boolean;
  margin?: "dense" | "normal";
}> = ({ journalType, onChange, allowMultiple, margin }) => {
  return (
    <FormControl
      margin={margin ?? "normal"}
      sx={{ backgroundColor: "common.white" }}
    >
      <InputLabel id="journal-type-label">
        {translations.label_journalType}
      </InputLabel>
      <Select
        id="journal-type"
        labelId="journal-type-label"
        label={translations.label_journalType}
        value={journalType as unknown as string}
        multiple={allowMultiple ?? false}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as JournalType);
        }}
        sx={{ ".MuiSelect-select": { display: "flex" } }}
      >
        <JournalTypeMenuItem
          journalType={JournalType.Scraps}
          label={translations.journalType_scraps}
        />
        <JournalTypeMenuItem
          journalType={JournalType.Counter}
          label={translations.journalType_counter}
        />
        <JournalTypeMenuItem
          journalType={JournalType.Gauge}
          label={translations.journalType_gauge}
        />
        <JournalTypeMenuItem
          journalType={JournalType.Timer}
          label={translations.journalType_timer}
        />
      </Select>
    </FormControl>
  );
};
