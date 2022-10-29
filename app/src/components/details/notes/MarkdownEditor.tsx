import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { useAppContext } from "../../../AppContext";
import { useNavigate } from "react-router-dom";
import { SaveOutlined } from "@mui/icons-material";
import { editActionKey } from "../../overview/getMetricHeaderActions";
import { styled } from "@mui/material";

export const MarkdownEditor: React.FC<{
  metric: IMetric;
  onSaved: (notes: string) => void;
}> = ({ metric, onSaved }) => {
  const navigate = useNavigate();

  const { setAppAlert, titleActions, setTitleActions } = useAppContext();

  const [notes, setNotes] = useState(metric.notes ?? "");

  useEffect(() => {
    const editIndex = titleActions.findIndex((a) => a.key === editActionKey);
    const newActions = [...titleActions];

    newActions[editIndex] = {
      label: "Save",
      onClick: saveNote,
      icon: <SaveOutlined />,
      key: "save",
    };
    setTitleActions(newActions);

    return () => setTitleActions(titleActions);
  }, []);

  return (
    <Host>
      <CodeMirror
        value={notes}
        extensions={[markdown({})]}
        onChange={(value: string) => setNotes(value)}
      />
    </Host>
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

        onSaved(notes);

        navigate("..");
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

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
