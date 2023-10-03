import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { useJournalContext } from "../JournalDetailsContext";

const noElementsValue = "-";

export const AttributeFilters: React.FC = () => {
  const { selectedAttributeValues, setSelectedAttributeValues, journal } =
    useJournalContext();

  if (!Object.keys(journal.attributes || {}).length) {
    return null;
  }

  return (
    <>
      {Object.keys(journal.attributes).map((attributeKey) => {
        const attribute = journal.attributes[attributeKey];

        const selectedValues = selectedAttributeValues?.[attributeKey];
        const keys: string[] = selectedValues?.length
          ? selectedValues
          : [noElementsValue];

        return (
          <FormControl key={attributeKey} margin="none" sx={{ flexGrow: 1 }}>
            <InputLabel id={`journal-attribute-${attributeKey}-label`}>
              {attribute.name}
            </InputLabel>
            <Select
              id={`journal-attribute-${attributeKey}`}
              labelId={`journal-attribute-${attributeKey}-label`}
              label={attribute.name}
              multiple
              value={keys}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const selectedKeys = event.target.value as string[];

                if (
                  selectedKeys.indexOf(noElementsValue) > -1 &&
                  keys.indexOf(noElementsValue) === -1
                ) {
                  setSelectedAttributeValues(attributeKey, []);
                  return;
                }

                setSelectedAttributeValues(
                  attributeKey,
                  selectedKeys?.length === 1 &&
                    selectedKeys[0] === noElementsValue
                    ? []
                    : selectedKeys.filter((k) => k !== noElementsValue),
                );
              }}
            >
              <MenuItem key={noElementsValue} value={noElementsValue}>
                {noElementsValue}
              </MenuItem>
              {Object.keys(attribute.values).map((valueKey) => (
                <MenuItem key={valueKey} value={valueKey}>
                  {attribute.values[valueKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </>
  );
};
