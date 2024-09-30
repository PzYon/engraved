import React, { useMemo, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  styled,
  TextField,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useUpdateUserTagsMutation } from "../../../serverApi/reactQuery/mutations/useUpsertUserTagsMutation";
import { useAppContext } from "../../../AppContext";
import { ActionIconButton } from "../../common/actions/ActionIconButton";

export const ManageUserTags: React.FC = () => {
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
        <StyledListItem
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
        </StyledListItem>
      ))}
      <StyledListItem
        secondaryAction={
          newItem ? (
            <ActionIconButton
              action={{
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
    if (!newItem) {
      return;
    }

    onAddOption(newItem);
    setNewItem("");
  }
};

const StyledListItem = styled(ListItem)`
  padding-left: 0;
`;
