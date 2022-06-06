import React from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

interface IOption {
  key: string;
  addNewKey?: string;
  label: string;
}

const filter = createFilterOptions<IOption>({
  ignoreCase: true,
  matchFrom: "any",
});

export const MetricAttributeSelector: React.FC<{
  attributeKey: string;
  attribute: IMetricAttribute;
  selectedAttributeValues: IMetricAttributeValues;
  onChange: (attributesValues: IMetricAttributeValues) => void;
}> = ({ attributeKey, attribute, selectedAttributeValues, onChange }) => {
  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField
          {...params}
          label={attribute.name}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            ),
          }}
        />
      )}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      getOptionLabel={(o) => {
        const option = o as IOption;

        return option.addNewKey &&
          getSelectedAttributeValue() == option.addNewKey
          ? option.addNewKey + " *"
          : option.label;
      }}
      isOptionEqualToValue={(option, value) => {
        const o = option as IOption;
        const v = value as IOption;

        return o.key == v.key;
      }}
      options={Object.entries(attribute.values).map((arr) => ({
        key: arr[0],
        label: arr[1],
      }))}
      onChange={async (_, selectedOption) => {
        const option: IOption = selectedOption as IOption;

        onChange({
          ...selectedAttributeValues,
          ...{ [attributeKey]: [option?.addNewKey || option?.key] },
        });
      }}
      filterOptions={(options: IOption[], params) => {
        const { inputValue } = params;
        const isExisting = options.some((o) => inputValue === o.label);

        const filtered = filter(options, params);

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            key: inputValue,
            addNewKey: inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
    />
  );

  function getSelectedAttributeValue(): string {
    const values = selectedAttributeValues?.[attributeKey] || [];
    return values[0];
  }
};
