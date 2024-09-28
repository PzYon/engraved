import React, { useMemo, useState } from "react";
import { useAppContext } from "../AppContext";
import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import { ActionIconButton } from "../components/common/actions/ActionIconButton";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useUpdateUserTagsMutation } from "../serverApi/reactQuery/mutations/useUpsertUserTagsMutation";

export const ManageTags: React.FC = () => {
  const { user } = useAppContext();

  const initialTagNames = useMemo(() => {
    return Object.keys(user.tags ?? {});
  }, []);

  const [tagNames, setTagNames] = useState(initialTagNames);

  const updateTagsMutation = useUpdateUserTagsMutation();

  return (
    <>
      <EditableList
        options={tagNames.map((t) => {
          return {
            value: t,
            label: t,
          };
        })}
        onAddOption={(label) => {
          setTagNames([...tagNames, label]);
        }}
        onDeleteOption={(key) => {
          const index = tagNames.indexOf(key);
          tagNames.splice(index, 1);
          setTagNames([...tagNames]);
        }}
      />
      {JSON.stringify(tagNames) === JSON.stringify(initialTagNames) ? null : (
        <Button
          onClick={() => {
            updateTagsMutation.mutate({ tagNames });
          }}
        >
          Save
        </Button>
      )}
    </>
  );
};

export interface IOption {
  value: string;
  label: string;
}

export const EditableList: React.FC<{
  options: IOption[];
  onAddOption: (label: string) => void;
  onDeleteOption: (key: string) => void;
}> = ({ options, onAddOption, onDeleteOption }) => {
  const [newItem, setNewItem] = useState("");

  return (
    <List dense>
      {options.map((o) => (
        <ListItem
          key={o.value}
          secondaryAction={
            <ActionIconButton
              action={{
                key: "remove",
                label: "Remove",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => onDeleteOption(o.value),
              }}
            />
          }
        >
          <ListItemText primary={o.label} />
        </ListItem>
      ))}
      <ListItem
        secondaryAction={
          newItem ? (
            <ActionIconButton
              action={{
                key: "add",
                label: "Add",
                icon: <AddCircleOutline fontSize="small" />,
                onClick: () => {
                  onAddOption(newItem);
                  setNewItem("");
                },
              }}
            />
          ) : null
        }
      >
        <TextField
          key={JSON.stringify(options)}
          value={newItem}
          style={{ width: "100%" }}
          size="small"
          onChange={(event) => {
            setNewItem(event.target.value);
          }}
        />
      </ListItem>
    </List>
  );
};
