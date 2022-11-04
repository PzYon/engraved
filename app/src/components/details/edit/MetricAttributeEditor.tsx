import React, { useState } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { ListItemTextField } from "./ListItemTextField";

export const MetricAttributeEditor: React.FC<{
  attribute: IMetricAttribute;
  onChange: (attribute: IMetricAttribute) => void;
}> = ({ attribute, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <ListItemButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{ border: "1px solid lightgray", marginBottom: "16px" }}
      >
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
              <ListItemButton onClick={() => handleOnChange(key, null)}>
                <ListItemIcon>
                  <RemoveCircleOutline fontSize="small" />
                </ListItemIcon>
              </ListItemButton>
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

    if (value) {
      updatedAttribute.values[attributeKey] = value;
    } else {
      delete updatedAttribute.values[attributeKey];
    }

    return onChange(updatedAttribute);
  }
};
