import React, { useCallback, useMemo, useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Options } from "easymde";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";

// markdown editor:
// https://www.npmjs.com/package/easymde#simplemde-fork

export const NotesDetails: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const [notes, setNotes] = useState(metric.notes);

  const onChange = useCallback((value: string) => {
    setNotes(value);
  }, []);

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
    } as Options;
  }, []);

  return (
    <Typography>
      <SimpleMdeReact
        options={autofocusNoSpellcheckerOptions}
        value={notes}
        onChange={onChange}
      />
      <Button variant="outlined" onClick={saveNote}>
        Save
      </Button>
    </Typography>
  );

  function saveNote() {
    ServerApi.editMetric(
      metric.id,
      metric.name,
      metric.description,
      notes,
      metric.attributes
    );
  }
};
