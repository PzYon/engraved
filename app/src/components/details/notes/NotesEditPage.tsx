import React, { useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useMetricContext } from "../MetricDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../PageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { VisibilityOutlined } from "@mui/icons-material";
import { Markdown } from "./Markdown";
import { EditCommonProperties } from "../edit/EditCommonProperties";
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";

export const NotesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { metric } = useMetricContext();

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);
  const [notes, setNotes] = useState(metric.notes);

  const [isPreview, setIsPreview] = useState(false);

  const editMetricMutation = useEditMetricMutation(metric.id);

  const disableSave =
    notes === metric.notes &&
    name === metric.name &&
    description === metric.description;

  return (
    <Page
      title={<PageTitle metric={metric} />}
      documentTitle={`Edit ${metric.name}`}
      actions={[
        ...getCommonEditModeActions(
          navigate,
          () =>
            editMetricMutation.mutate({
              metric: { ...metric, name, description, notes },
              onSuccess: () => navigate("./.."),
            }),
          disableSave
        ),
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
};
