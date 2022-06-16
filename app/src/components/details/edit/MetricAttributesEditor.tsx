import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import React, { useState } from "react";
import { MetricAttributeEditor } from "./MetricAttributeEditor";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { ListItemTextField } from "./ListItemTextField";
import { AddCircleOutline } from "@mui/icons-material";

export const MetricAttributesEditor: React.FC<{
  attributes: IMetricAttributes;
  setAttributes: (attributes: IMetricAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  const [showAddNewInput, setShowAddNewInput] = useState(false);

  return (
    <FormSection title="Attributes">
      <List>
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
    </FormSection>
  );
};

const FormSection: React.FC<{
  children: React.ReactElement;
  title: string;
}> = ({ children, title }) => {
  return (
    <Host>
      <Title>{title}</Title>
      {children}
    </Host>
  );
};

const Host = styled("div")`
  margin-top: 15px;
  position: relative;
  border-radius: 4px;
  border: 1px solid rgb(0 0 0 / 23%);
`;

const Title = styled(Typography)`
  position: absolute;
  top: -10px;
  font-size: small;
  left: 6px;
  background-color: rgb(255 255 255);
  padding: 0 5px;
`;
