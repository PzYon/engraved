import React, { useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useMetricDetailsContext } from "../MetricDetailsContext";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import { Page } from "../../common/Page";
import { SaveOutlined } from "@mui/icons-material";

export const NotesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();
  const { metric, reloadMetric } = useMetricDetailsContext();
  const [notes, setNotes] = useState(metric.notes);

  return (
    <Page
      actions={[
        {
          key: "save",
          label: "Save",
          icon: <SaveOutlined fontSize="small" />,
          onClick: saveNote,
        },
      ]}
    >
      <MarkdownEditor value={notes} onChange={setNotes} />
    </Page>
  );

  function saveNote() {
    ServerApi.editMetric(
      metric.id,
      metric.name,
      metric.description,
      notes,
      metric.attributes,
      metric.thresholds
    )
      .then(async () => {
        await reloadMetric();

        setAppAlert({
          title: "Saved note",
          type: "success",
        });

        navigate("./..");
      })
      .catch((e) => {
        setAppAlert({
          title: "Failed to edit note",
          message: e.message,
          type: "error",
        });
      });
  }
};
