import React, { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { useUpdateUserTagsMutation } from "../../../serverApi/reactQuery/mutations/useUpsertUserTagsMutation";
import { useAppContext } from "../../../AppContext";
import { Link } from "react-router-dom";
import { EditableList } from "../../common/EditableList";

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
        options={tagNames.map((t) => ({
          value: t,
          label: t,
        }))}
        onAddOption={(label) => {
          setTagNames([...tagNames, label]);
        }}
        onDeleteOption={(key) => {
          const index = tagNames.indexOf(key);
          tagNames.splice(index, 1);
          setTagNames([...tagNames]);
        }}
        onEditOption={(key, label) => {
          const index = tagNames.indexOf(key);
          tagNames[index] = label;
          setTagNames([...tagNames]);
        }}
        renderOption={(option) => (
          <Link target="_blank" to={`/tags/${option.value}`}>
            {option.label}
          </Link>
        )}
      />
      {JSON.stringify(tagNames) === JSON.stringify(initialTagNames) ? null : (
        <Button onClick={() => updateTagsMutation.mutate({ tagNames })}>
          Save
        </Button>
      )}
    </>
  );
};
