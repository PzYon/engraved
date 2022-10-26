import React, { useEffect, useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { Button, TextField, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";
import { Route, Routes } from "react-router-dom";

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

  return (
    <>
      <Typography>
        <TextField
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <Button variant="outlined" onClick={saveNote}>
          Save
        </Button>
      </Typography>
      <Routes>
        <Route path="/edit" element={<div>Here comes edit stuff.</div>} />
      </Routes>
    </>
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
