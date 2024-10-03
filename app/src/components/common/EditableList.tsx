import React, { useState } from "react";
import { ActionIconButton } from "./actions/ActionIconButton";
import { List, ListItem, ListItemText, styled, TextField } from "@mui/material";
import {
  AddCircleOutline,
  Edit,
  RemoveCircleOutline,
} from "@mui/icons-material";

export interface IOption {
  value: string;
  label: string;
}

export const EditableList: React.FC<{
  options: IOption[];
  onAddOption: (label: string) => void;
  onDeleteOption: (key: string) => void;
  onEditOption: (key: string, value: string) => void;
  renderOption: (option: IOption) => React.ReactNode;
}> = ({ options, onAddOption, onDeleteOption, onEditOption, renderOption }) => {
  const [newItem, setNewItem] = useState("");
  const [editItemKey, setEditItemKey] = useState<string>(undefined);

  const doesExist = options.map((o) => o.label).indexOf(newItem) > -1;

  return (
    <List dense>
      {options.map((o) => (
        <StyledListItem
          key={o.value}
          secondaryAction={
            <>
              <ActionIconButton
                action={{
                  key: "edit",
                  label: "Edit",
                  icon: <Edit fontSize="small" />,
                  onClick: () => setEditItemKey(o.value),
                }}
              />
              <ActionIconButton
                action={{
                  key: "remove",
                  label: "Remove",
                  icon: <RemoveCircleOutline fontSize="small" />,
                  onClick: () => onDeleteOption(o.value),
                }}
              />
            </>
          }
        >
          {editItemKey === o.value ? (
            <TextField
              id={Math.random().toString()}
              autoFocus={true}
              defaultValue={o.label}
              style={{ width: "100%" }}
              size="small"
              onBlur={(e) => {
                onEditOption(o.value, e.target.value);
              }}
            />
          ) : (
            <ListItemText primary={renderOption(o)} />
          )}
        </StyledListItem>
      ))}
      <StyledListItem
        secondaryAction={
          newItem ? (
            <ActionIconButton
              action={{
                isDisabled: doesExist,
                key: "add",
                label: "Add",
                icon: <AddCircleOutline fontSize="small" />,
                onClick: addNewItem,
              }}
            />
          ) : null
        }
      >
        <TextField
          id={Math.random().toString()}
          autoFocus={true}
          key={JSON.stringify(options)}
          value={newItem}
          style={{ width: "100%" }}
          size="small"
          onChange={(event) => {
            setNewItem(event.target.value);
          }}
          onBlur={addNewItem}
        />
      </StyledListItem>
    </List>
  );

  function addNewItem() {
    if (!newItem || doesExist) {
      return;
    }

    onAddOption(newItem);
    setNewItem("");
  }
};

const StyledListItem = styled(ListItem)`
  padding-left: 0;
`;
