import React, { useState } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const MetricAttributeEditor: React.FC<{
  attribute: IMetricAttribute;
  onChange: (attribute: IMetricAttribute) => void;
}> = ({ attribute, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <ListItemButton onClick={() => setIsCollapsed(!isCollapsed)}>
        <ListItemText primary={attribute.name} />
        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
      </ListItemButton>

      <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
        <List dense={true}>
          {Object.entries(attribute.values || {}).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemTextField
                defaultValue={value}
                isExisting={true}
                onBlur={(newValue) => handleOnChange(key, newValue)}
              />
            </ListItem>
          ))}
        </List>

        <ListItem key={"add_new_value"}>
          <ListItemText>
            <ListItemTextField
              onBlur={(newValue: string) => handleOnChange(newValue, newValue)}
            />
          </ListItemText>
        </ListItem>
      </Collapse>
    </>
  );

  function handleOnChange(attributeKey: string, value: string) {
    const updatedAttribute = { ...attribute };
    updatedAttribute.values[attributeKey] = value;

    return onChange(updatedAttribute);
  }
};

const ListItemTextField: React.FC<{
  defaultValue?: string;
  onBlur?: (newValue: string) => void;
  isExisting?: boolean;
}> = ({ defaultValue, onBlur, isExisting }) => {
  const [disabled, setDisabled] = useState(isExisting);

  const [value, setValue] = useState(defaultValue);

  return (
    <TextField
      value={value}
      disabled={disabled}
      size="small"
      onChange={(event) => setValue(event.target.value)}
      onClick={() => setDisabled(false)}
      onBlur={(event) => {
        const newValue = event.target.value;
        if (!newValue) {
          return;
        }

        onBlur(newValue);

        if (isExisting) {
          setDisabled(true);
          return;
        }

        setValue("");
      }}
    />
  );
};
