import React, { useState } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import {
  Button,
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
  const [showInput, setShowInput] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <ListItemButton onClick={() => setIsCollapsed(!isCollapsed)}>
        <ListItemText primary={attribute.name} />
        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
      </ListItemButton>

      <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
        <List dense={true}>
          {Object.entries(attribute.values || {}).map(([key, value]) => {
            return (
              <ListItem key={key}>
                <ListItemText>{value}</ListItemText>
              </ListItem>
            );
          })}
        </List>

        <Button onClick={() => setShowInput(true)}>Add new value</Button>
        {showInput ? (
          <TextField
            size="small"
            onBlur={(event) => {
              const newValue = event.target.value;

              const updatedAttribute = { ...attribute };
              updatedAttribute.values[newValue] = newValue;

              return onChange(updatedAttribute);
            }}
          />
        ) : null}
      </Collapse>
    </>
  );
};
