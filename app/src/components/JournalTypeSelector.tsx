import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { JournalType } from "../serverApi/JournalType";
import { translations } from "../i18n/translations";
import { JournalTypeIcon } from "./common/JournalTypeIcon";
import { IconStyle } from "./common/Icon";

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
        <MenuItem value={JournalType.Scraps}>
          <JournalTypeMenuItem
            journalType={JournalType.Scraps}
            label={translations.metricType_scraps}
          />
        </MenuItem>
        <MenuItem value={JournalType.Counter}>
          <JournalTypeMenuItem
            journalType={JournalType.Counter}
            label={translations.metricType_counter}
          />
        </MenuItem>
        <MenuItem value={JournalType.Gauge}>
          <JournalTypeMenuItem
            journalType={JournalType.Gauge}
            label={translations.metricType_gauge}
          />
        </MenuItem>
        <MenuItem value={JournalType.Timer}>
          <JournalTypeMenuItem
            journalType={JournalType.Timer}
            label={translations.metricType_timer}
          />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const JournalTypeMenuItem: React.FC<{
  journalType: JournalType;
  label: string;
}> = ({ journalType, label }) => {
  return (
    <MenuItemContainer>
      <JournalTypeIcon type={journalType} style={IconStyle.Activity} />
      {label}
    </MenuItemContainer>
  );
};

const MenuItemContainer = styled("div")`
  display: inline-flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
  }
`;
