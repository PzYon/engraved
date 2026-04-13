import React, { useState } from "react";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RemoveCircleOutlined from "@mui/icons-material/RemoveCircleOutlined";
import { ListItemTextField } from "./ListItemTextField";
import { ActionIconButton } from "../../common/actions/ActionIconButton";

export const JournalAttributeEditor: React.FC<{
  attribute: IJournalAttribute;
  onChange: (attribute: IJournalAttribute) => void;
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
              <Tooltip title="Set as default value">
                <Checkbox
                  size="small"
                  checked={attribute.defaultValue === key}
                  onChange={(_, checked) =>
                    handleDefaultValueChange(checked ? key : null)
                  }
                />
              </Tooltip>
              <ListItemTextField
                defaultValue={value}
                isExisting={true}
                onBlur={(newValue) => handleOnChange(key, newValue)}
              />
              <ActionIconButton
                action={{
                  key: "remove",
                  label: "Remove",
                  icon: <RemoveCircleOutlined fontSize="small" />,
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

  function handleDefaultValueChange(key: string | null) {
    onChange({ ...attribute, defaultValue: key ?? undefined });
  }

  function handleOnChange(attributeKey: string, value: string) {
    const updatedAttribute = { ...attribute };

    if (value) {
      updatedAttribute.values[attributeKey] = value;
    } else {
      delete updatedAttribute.values[attributeKey];
      if (updatedAttribute.defaultValue === attributeKey) {
        updatedAttribute.defaultValue = undefined;
      }
    }

    return onChange(updatedAttribute);
  }
};
