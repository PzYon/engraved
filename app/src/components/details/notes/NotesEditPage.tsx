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
import { EditCommonProperties } from "../edit/EditCommonProperties";

export const NotesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();
  const { metric } = useMetricContext();

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);
  const [notes, setNotes] = useState(metric.notes);

  const [isPreview, setIsPreview] = useState(false);

  const disableSave =
    notes === metric.notes &&
    name === metric.name &&
    description === metric.description;

  return (
    <Page
      title={<PageTitle metric={metric} />}
      documentTitle={`Edit ${metric.name}`}
      actions={[
        ...getCommonEditModeActions(navigate, saveNote, disableSave),
        {
          key: "preview",
          label: "Preview",
          icon: <VisibilityOutlined fontSize="small" />,
          isNotActive: !isPreview,
          onClick: () => {
            setIsPreview(!isPreview);
          },
        },
      ]}
    >
      <EditCommonProperties
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />
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
      name,
      description,
      notes,
      metric.attributes,
      metric.thresholds,
      {}
    )
      .then(async () => {
        // note: this will also be handled by react-query
        // await reloadMetric();

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
