import React, { useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useMetricContext } from "../MetricDetailsContext";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../PageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { VisibilityOutlined } from "@mui/icons-material";
import { Markdown } from "./Markdown";

export const NotesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();
  const { metric, reloadMetric } = useMetricContext();
  const [notes, setNotes] = useState(metric.notes);
  const [isPreview, setIsPreview] = useState(false);

  return (
    <Page
      title={<PageTitle metric={metric} />}
      actions={[
        ...getCommonEditModeActions(saveNote, navigate),
        {
          key: "preview",
          label: "Preview",
          icon: <VisibilityOutlined fontSize="small" />,
          onClick: () => {
            setIsPreview(!isPreview);
          },
        },
      ]}
    >
      {isPreview ? (
        <Markdown value={notes} />
      ) : (
        <MarkdownEditor value={notes} onChange={setNotes} />
      )}
    </Page>
  );

  function saveNote() {
    ServerApi.editMetric(
      metric.id,
      metric.name,
      metric.description,
      notes,
      metric.attributes,
      metric.thresholds,
      {}
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
