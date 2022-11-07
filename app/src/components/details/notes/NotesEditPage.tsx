import React, { useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useMetricContext } from "../MetricDetailsContext";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import { Page } from "../../layout/pages/Page";
import { SaveOutlined } from "@mui/icons-material";
import { PageTitle } from "../PageTitle";

export const NotesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();
  const { metric, reloadMetric } = useMetricContext();
  const [notes, setNotes] = useState(metric.notes);

  return (
    <Page
      title={<PageTitle metric={metric} />}
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
