import React, { useState } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { ListItemTextField } from "./ListItemTextField";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";

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
              <IconButtonWrapper
                action={{
                  key: "remove",
                  label: "Remove",
                  icon: <RemoveCircleOutline fontSize="small" />,
                  onClick: () => handleOnChange(key, null),
                }}
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

    if (value) {
      updatedAttribute.values[attributeKey] = value;
    } else {
      delete updatedAttribute.values[attributeKey];
    }

    return onChange(updatedAttribute);
  }
};
