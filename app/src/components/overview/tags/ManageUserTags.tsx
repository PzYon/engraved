import React, { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { useUpdateUserTagsMutation } from "../../../serverApi/reactQuery/mutations/useUpsertUserTagsMutation";
import { useAppContext } from "../../../AppContext";
import { Link } from "react-router-dom";
import { EditableList } from "../../common/EditableList";

export const ManageUserTags: React.FC = () => {
  const { user } = useAppContext();

  const initialTags = useMemo(() => {
    return Object.keys(user.tags ?? []);
  }, []);

  const [tags, setTags] = useState(user.tags ?? []);

  const updateTagsMutation = useUpdateUserTagsMutation();

  return (
    <>
      <EditableList
        options={tags.map((t) => ({
          key: t.id,
          label: t.label,
        }))}
        onAddOption={(label) => {
          const newTags = [...tags];
          newTags.push({
            id: crypto.randomUUID(),
            label: label,
          });
          setTags(newTags);
        }}
        onDeleteOption={(key) => {
          const newTags = [...tags];
          newTags.splice(
            tags.findIndex((t) => t.id === key),
            1,
          );
          setTags(newTags);
        }}
        onEditOption={(key, label) => {
          const newTags = [...tags];
          newTags[tags.findIndex((t) => t.id === key)].label = label;
          setTags(newTags);
        }}
        renderOption={(option) => (
          <Link target="_blank" to={`/tags/${option.key}`}>
            {option.label}
          </Link>
        )}
      />
      {JSON.stringify(tags) === JSON.stringify(initialTags) ? null : (
        <Button
          onClick={() =>
            updateTagsMutation.mutate({
              tagNames: tags.reduce(
                (previousValue, currentValue) => {
                  previousValue[currentValue.id] = currentValue.label;
                  return previousValue;
                },
                {} as Record<string, string>,
              ),
            })
          }
        >
          Save
        </Button>
      )}
    </>
  );
};
