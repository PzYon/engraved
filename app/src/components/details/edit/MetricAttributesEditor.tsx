import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import React, { useState } from "react";
import { MetricAttributeEditor } from "./MetricAttributeEditor";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
} from "@mui/material";
import { ListItemTextField } from "./ListItemTextField";
import { AddCircleOutline } from "@mui/icons-material";

export const MetricAttributesEditor: React.FC<{
  attributes: IMetricAttributes;
  setAttributes: (attributes: IMetricAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  const [showAddNewInput, setShowAddNewInput] = useState(false);

  return (
    <Host>
      <List subheader={<ListSubheader>Attributes</ListSubheader>}>
        {Object.entries(attributes).map(([key, value]) => (
          <MetricAttributeEditor
            key={key}
            attribute={value}
            onChange={(attribute) => {
              const newAttributes = { ...attributes };
              newAttributes[key] = attribute;
              setAttributes(newAttributes);
            }}
          />
        ))}

        <ListItem key={"add_new_attribute"}>
          <ListItemText>
            {showAddNewInput ? (
              <ListItemTextField
                onBlur={(newValue: string) => {
                  const newAttributes = { ...attributes };
                  newAttributes[newValue] = {
                    name: newValue,
                    values: {},
                  };

                  setAttributes(newAttributes);
                  setShowAddNewInput(false);
                }}
              />
            ) : (
              <ListItemButton onClick={() => setShowAddNewInput(true)}>
                <ListItemIcon>
                  <AddCircleOutline fontSize="small" />
                </ListItemIcon>
              </ListItemButton>
            )}
          </ListItemText>
        </ListItem>
      </List>
    </Host>
  );
};

const Host = styled("div")`
  border-radius: 4px;
  border: 1px solid rgb(0 0 0 / 23%);
`;
