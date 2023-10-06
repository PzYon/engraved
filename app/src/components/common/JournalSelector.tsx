import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalType } from "../../serverApi/JournalType";
import { Autocomplete, MenuItem, TextField } from "@mui/material";

import { JournalTypeMenuItem } from "../JournalTypeMenuItem";

export const JournalSelector: React.FC<{
  onChange: (journal: IJournal) => void;
  label?: string;
  selectedJournalId?: string;
}> = ({ onChange, label, selectedJournalId }) => {
  const journals = useJournalsQuery("", [JournalType.Scraps]);

  return (
    <Autocomplete
      value={journals.filter((j) => j.id === selectedJournalId)[0]}
      options={journals}
      onChange={async (_, selectedOption) => {
        onChange(selectedOption);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={params.InputProps}
          label={label ?? "Journals"}
        />
      )}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <MenuItem {...props} key={option.id}>
          <JournalTypeMenuItem journalType={option.type} label={option.name} />
        </MenuItem>
      )}
      filterOptions={(currenOptions, state) => {
        return currenOptions.filter(
          (j) =>
            j.name?.toLowerCase().indexOf(state.inputValue?.toLowerCase()) > -1,
        );
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
    />
  );
};
