import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Options } from "easymde";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";

// markdown editor:
// https://www.npmjs.com/package/easymde#simplemde-fork

export const NotesDetailsInner: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const [notes, setNotes] = useState(metric.notes);

  const { setAppAlert, setTitleActions } = useAppContext();

  useEffect(() => {
    setTitleActions(getMetricHeaderActions(metric));

    return () => {
      setTitleActions([]);
    };
  }, [metric]);

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
    )
      .then(() => {
        setAppAlert({
          title: "Saved metric",
          type: "success",
        });
      })
      .catch((e) => {
        setAppAlert({
          title: "Failed to edit metric",
          message: e.message,
          type: "error",
        });
      });
  }
};
