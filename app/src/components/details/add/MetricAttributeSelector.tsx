import React, { useMemo } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import {
  Autocomplete,
  createFilterOptions,
  FilterOptionsState,
  TextField,
} from "@mui/material";

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
  const options = useMemo(
    () =>
      Object.entries(attribute.values).map((arr) => ({
        key: arr[0],
        label: arr[1],
      })),
    [attribute.values]
  );

  const selectedOption = options.filter((o) => {
    return selectedAttributeValues[attributeKey]?.indexOf(o.key) > -1;
  })[0];

  return (
    <Autocomplete
      options={options}
      defaultValue={selectedOption}
      getOptionLabel={(option) => getOptionLabel(option as IOption)}
      isOptionEqualToValue={(option, value) =>
        areOptionsEqual(option as IOption, value as IOption)
      }
      filterOptions={filterOptions}
      onChange={async (_, selectedOption) => {
        const option: IOption = selectedOption as IOption;

        onChange({
          ...selectedAttributeValues,
          ...{ [attributeKey]: [option?.addNewKey || option?.key] },
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={attribute.name}
          InputProps={params.InputProps}
        />
      )}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
    />
  );

  function getSelectedAttributeValue(): string {
    const values = selectedAttributeValues?.[attributeKey] || [];
    return values[0];
  }

  function areOptionsEqual(a: IOption, b: IOption): boolean {
    return a.key == b.key;
  }

  function filterOptions(
    options: IOption[],
    params: FilterOptionsState<IOption>
  ): IOption[] {
    const { inputValue } = params;

    const isExisting = options.some(
      (o) => inputValue?.toLowerCase() === o.label?.toLowerCase()
    );

    const filtered = filter(options, params);

    if (inputValue !== "" && !isExisting) {
      filtered.push({
        key: inputValue,
        addNewKey: inputValue,
        label: `Add "${inputValue}"`,
      });
    }

    return filtered;
  }

  function getOptionLabel(option: IOption): string {
    return option.addNewKey && getSelectedAttributeValue() == option.addNewKey
      ? option.addNewKey + " *"
      : option.label;
  }
};
