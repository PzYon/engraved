import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import React, { useEffect, useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { styled, TextField } from "@mui/material";
import { AttributeValueSelector } from "../../common/AttributeValueSelector";

export interface IThresholdDefinition {
  attributeKey: string;
  attributeValueKeys: string[];
  threshold: number;
  key?: string;
}

export const ThresholdRow: React.FC<{
  journal: IJournal;
  definition: IThresholdDefinition;
  onChange: (definition: IThresholdDefinition) => void;
  styles: React.CSSProperties;
}> = ({ journal, definition, onChange, styles }) => {
  const [attributeKey, setAttributeKey] = useState(
    definition?.attributeKey ?? "",
  );
  const [attributeValueKeys, setAttributeValueKeys] = useState<string[]>(
    definition?.attributeValueKeys ?? [],
  );
  const [threshold, setThreshold] = useState(definition?.threshold ?? "");

  useEffect(() => {
    onChange({
      attributeKey,
      attributeValueKeys,
      threshold: Number(threshold),
    });
  }, [onChange, attributeKey, attributeValueKeys, threshold]);

  return (
    <Host sx={styles}>
      <GroupByAttributeSelector
        attributes={journal.attributes}
        onChange={setAttributeKey}
        selectedAttributeKey={attributeKey}
        label={"Attribute"}
      />
      {attributeKey ? (
        <AttributeValueSelector
          attribute={journal.attributes[attributeKey]}
          selectedValue={attributeValueKeys[0]}
          onChange={(attributesValues) => {
            setAttributeValueKeys(attributesValues);
          }}
        />
      ) : null}
      {Object.keys(attributeValueKeys).length ? (
        <TextField
          label={"Threshold Value"}
          type="number"
          defaultValue={threshold}
          onBlur={(event) => setThreshold(event.target.value)}
        />
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  padding: ${(p) => p.theme.spacing(1)} 0;

  display: flex;

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
