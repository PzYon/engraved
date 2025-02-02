import React, { useEffect, useMemo, useState } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalType } from "../../serverApi/JournalType";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { JournalMenuItem } from "../JournalMenuItem";
import { StorageWrapper } from "../../util/StorageWrapper";
import { useAppContext } from "../../AppContext";

const storage = new StorageWrapper(window.localStorage);

export const JournalSelector: React.FC<{
  onChange: (journal: IJournal) => void;
  filterJournals: (journals: IJournal[]) => IJournal[];
  storageKey: string;
  label?: string;
}> = ({ onChange, filterJournals, label, storageKey: identifier }) => {
  const storageKey = `engraved::last-selected-journal::${identifier}`;

  const { user } = useAppContext();

  const journals = useJournalsQuery("", [JournalType.Scraps]);

  const [selectedJournalId, setSelectedJournalId] = useState<string>(
    () => storage.getValue<string>(storageKey) ?? user.favoriteJournalIds[0],
  );

  const selectedJournal = useMemo(
    () =>
      journals && selectedJournalId
        ? (journals.find((j) => j.id === selectedJournalId) ?? journals[0])
        : null,
    [journals, selectedJournalId],
  );

  useEffect(() => {
    if (selectedJournal) {
      onChange(selectedJournal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJournal]);

  if (!journals?.length) {
    return null;
  }

  return (
    <Autocomplete
      autoFocus={true}
      value={selectedJournal}
      options={filterJournals(journals)}
      onChange={async (_, selectedOption) => {
        onChange(selectedOption);
        setSelectedJournalId(selectedOption.id);
        storage.setValue(storageKey, selectedOption.id);
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
          <JournalMenuItem journal={option} />
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
