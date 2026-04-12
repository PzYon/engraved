import React, { useState } from "react";
import { IJournalAttributeValues } from "../../../serverApi/IJournalAttributeValues";
import { Autocomplete, Box, TextField } from "@mui/material";
import { AttributeValues } from "../../common/AttributeValues";
import { IJournal } from "../../../serverApi/IJournal";
import {
  IAttributeSearchResult,
  searchJournalAttributes,
} from "./searchAttributes/searchJournalAttributes";

let timer: number;

let lastLoadedSearchText = "";

export const AttributeComboSearch: React.FC<{
  journal: IJournal;
  onChange: (attributesValues: IJournalAttributeValues) => void;
}> = ({ journal, onChange }) => {
  const [options, setOptions] = useState<IAttributeSearchResult[]>([]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      onChange={(_, value) => {
        if (!value) {
          return;
        }

        setOptions([]);
        onChange((value as unknown as IAttributeSearchResult).values);
      }}
      getOptionLabel={() => {
        // label is used as value in input field when selected. as we
        // always want to display an empty text field after selection,
        // we return "".
        return "";
      }}
      renderOption={(props, option) => {
        const searchResult = option as IAttributeSearchResult;

        return (
          <Box {...props} key={JSON.stringify(searchResult)} component={"li"}>
            <AttributeValues
              attributes={journal.attributes}
              attributeValues={searchResult.values}
              preventOnClick={true}
            />
          </Box>
        );
      }}
      filterOptions={(currenOptions, state) => {
        filterOptionsAsync(state.inputValue);

        return currenOptions;
      }}
      renderInput={(params) => (
        <TextField {...params} label={"Search attributes"} />
      )}
    />
  );

  function filterOptionsAsync(searchText: string) {
    window.clearTimeout(timer);

    if (!searchText || searchText === lastLoadedSearchText) {
      return;
    }

    timer = window.setTimeout(() => {
      lastLoadedSearchText = searchText;

      const values = searchJournalAttributes(journal.attributes, searchText);
      setOptions(values);
    }, 300);
  }
};
