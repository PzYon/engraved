import React, { useEffect, useMemo } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalType } from "../../serverApi/JournalType";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { JournalMenuItem } from "../JournalMenuItem";

export const JournalSelector: React.FC<{
  onChange: (journal: IJournal) => void;
  label?: string;
  selectedJournalId?: string;
}> = ({ onChange, label, selectedJournalId }) => {
  const journals = useJournalsQuery("", [JournalType.Scraps]);

  const selectedJournal = useMemo(
    () =>
      journals
        ? journals.find((j) => j.id === selectedJournalId) ?? journals[0]
        : null,
    [journals, selectedJournalId],
  );

  useEffect(() => {
    if (selectedJournal) {
      onChange(selectedJournal);
    }
  }, [selectedJournal]);

  if (!journals?.length) {
    return null;
  }

  return (
    <Autocomplete
      value={selectedJournal}
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
          <JournalMenuItem journalType={option.type} label={option.name} />
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
