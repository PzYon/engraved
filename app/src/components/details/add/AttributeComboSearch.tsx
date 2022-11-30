import React, { useState } from "react";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { Autocomplete, Chip, MenuItem, TextField } from "@mui/material";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";
import { ServerApi } from "../../../serverApi/ServerApi";
import { AttributeValues } from "../../common/AttributeValues";
import { IMetric } from "../../../serverApi/IMetric";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timer: any;

let lastLoadedSearchText = "";

export const AttributeComboSearch: React.FC<{
  metric: IMetric;
  onChange: (attributesValues: IMetricAttributeValues) => void;
}> = ({ metric, onChange }) => {
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
          <MenuItem {...props} key={JSON.stringify(searchResult)}>
            <AttributeValues
              attributes={metric.attributes}
              attributeValues={searchResult.values}
              preventOnClick={true}
            />
            <Chip
              key="count"
              sx={{
                color: "common.black",
                marginLeft: "5px",
                fontSize: "small",
                height: "22px",
              }}
              title={searchResult.occurrenceCount.toString() + "x"}
              label={searchResult.occurrenceCount.toString() + "x"}
            />
          </MenuItem>
        );
      }}
      filterOptions={(currenOptions, state) => {
        filterOptionsAsync(state.inputValue);

        return currenOptions;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Search Combo"}
          InputProps={params.InputProps}
        />
      )}
    />
  );

  function filterOptionsAsync(searchText: string) {
    clearTimeout(timer);

    if (!searchText || searchText === lastLoadedSearchText) {
      return;
    }

    timer = setTimeout(() => {
      lastLoadedSearchText = searchText;
      ServerApi.searchMetricAttributes(metric.id, searchText).then(setOptions);
    }, 300);
  }
};
