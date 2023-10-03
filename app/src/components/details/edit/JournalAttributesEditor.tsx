import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import React, { useState } from "react";
import { JournalAttributeEditor } from "./JournalAttributeEditor";
import { List } from "@mui/material";
import { ListItemTextField } from "./ListItemTextField";
import { AddCircleOutline } from "@mui/icons-material";
import { ActionIconButton } from "../../common/actions/ActionIconButton";

export const JournalAttributesEditor: React.FC<{
  attributes: IJournalAttributes;
  setAttributes: (attributes: IJournalAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  const [showAddNewInput, setShowAddNewInput] = useState(false);

  return (
    <List>
      {Object.entries(attributes).map(([key, value]) => (
        <JournalAttributeEditor
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
        <ActionIconButton
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
