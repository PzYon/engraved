import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
} from "@mui/material";
import { AttributeValueSelector } from "../../common/AttributeValueSelector";
import { ThresholdScope } from "./ThresholdScope";

export interface IAttributeValueThresholdDefinition {
  attributeKey: string;
  attributeValueKeys: string[];
  threshold: number;
  scope: ThresholdScope;
  key?: string;
}

// todo:
// - consider improving types
// - make sure that every combination can only be defined once in the GUI

export const ThresholdRow: React.FC<{
  journal: IJournal;
  definition: IAttributeValueThresholdDefinition;
  onChange: (definition: IAttributeValueThresholdDefinition) => void;
  styles: React.CSSProperties;
}> = ({ journal, definition, onChange, styles }) => {
  const [attributeKey, setAttributeKey] = useState(
    definition?.attributeKey || "-",
  );
  const [attributeValueKeys, setAttributeValueKeys] = useState<string[]>(
    definition?.attributeValueKeys ?? [],
  );
  const [threshold, setThreshold] = useState(definition?.threshold ?? "");
  const [thresholdScope, setThresholdScope] = useState(
    definition?.scope ?? ThresholdScope.Month,
  );

  return (
    <Host sx={styles}>
      <GroupByAttributeSelector
        attributes={journal.attributes}
        onChange={(k) => {
          setAttributeKey(k);
          onChangeWrapper(
            k,
            attributeValueKeys,
            Number(threshold),
            thresholdScope,
          );
        }}
        selectedAttributeKey={attributeKey}
        label={"Attribute"}
      />
      {attributeKey ? (
        <AttributeValueSelector
          attribute={journal.attributes[attributeKey]}
          selectedValue={attributeValueKeys[0]}
          onChange={(attributesValues) => {
            setAttributeValueKeys(attributesValues);
            onChangeWrapper(
              attributeKey,
              attributesValues,
              Number(threshold),
              thresholdScope,
            );
          }}
        />
      ) : null}
      <FormControl
        margin={"normal"}
        sx={{ backgroundColor: "common.white", mt: 1 }}
      >
        <InputLabel id="threshold-scope-label">Scope</InputLabel>
        <Select
          id="threshold-scope"
          labelId="threshold-scope-label"
          label="Scope"
          value={thresholdScope as unknown as string}
          onChange={(event: SelectChangeEvent) => {
            const scope = event.target.value as unknown as ThresholdScope;
            setThresholdScope(scope);
            onChangeWrapper(
              attributeKey,
              attributeValueKeys,
              Number(threshold),
              scope,
            );
          }}
          sx={{ ".MuiSelect-select": { display: "flex" } }}
        >
          <MenuItem value={ThresholdScope.Day}>Day</MenuItem>
          <MenuItem value={ThresholdScope.Month}>Month</MenuItem>
          <MenuItem value={ThresholdScope.Overall}>Overall</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label={"Threshold Value"}
        type="number"
        defaultValue={threshold}
        onBlur={(event) => {
          const newThreshold = event.target.value;
          setThreshold(newThreshold);
          onChangeWrapper(
            attributeKey,
            attributeValueKeys,
            Number(newThreshold),
            thresholdScope,
          );
        }}
      />
    </Host>
  );

  function onChangeWrapper(
    key: string,
    valueKeys: string[],
    threshold: number,
    scope: ThresholdScope,
  ) {
    onChange({
      attributeKey: key ?? "-",
      attributeValueKeys: valueKeys || [],
      scope,
      threshold,
    });
  }
};

const Host = styled("div")`
  padding: ${(p) => p.theme.spacing(1)} 0;

  display: flex;
  align-items: center;

  & > div:not(:last-of-type) {
    margin-right: ${(p) => p.theme.spacing(1)};
  }

  .MuiFormControl-root,
  .MuiAutocomplete-root {
    width: 33%;
  }

  .MuiAutocomplete-root .MuiFormControl-root {
    width: 100%;
  }
`;
