import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import React, { useState } from "react";
import { MetricAttributeEditor } from "./MetricAttributeEditor";
import { List } from "@mui/material";
import { ListItemTextField } from "./ListItemTextField";
import { AddCircleOutline } from "@mui/icons-material";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";

export const MetricAttributesEditor: React.FC<{
  attributes: IMetricAttributes;
  setAttributes: (attributes: IMetricAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  const [showAddNewInput, setShowAddNewInput] = useState(false);

  return (
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
        <IconButtonWrapper
          action={{
            key: "add",
            label: "Add",
            icon: <AddCircleOutline fontSize="small" />,
            onClick: () => setShowAddNewInput(true),
          }}
        />
      )}
    </List>
  );
};
