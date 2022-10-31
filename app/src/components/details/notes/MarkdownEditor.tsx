import React, { Suspense, useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { useAppContext } from "../../../AppContext";
import { useNavigate } from "react-router-dom";
import { SaveOutlined } from "@mui/icons-material";
import { editActionKey } from "../../overview/getMetricHeaderActions";
import { styled, Theme, useTheme } from "@mui/material";

export interface ICodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
}

const LazyCodeMirror = React.lazy(() => import("./LazyCodeMirror"));

export const MarkdownEditor: React.FC<{
  metric: IMetric;
  onSaved: (notes: string) => void;
}> = ({ metric, onSaved }) => {
  const navigate = useNavigate();
  const { setAppAlert, titleActions, setTitleActions } = useAppContext();
  const theme = useTheme();

  const [notes, setNotes] = useState(metric.notes ?? "");

  useEffect(() => {
    replaceAction(notes);
    return () => setTitleActions(titleActions);
  }, []);

  return (
    <Host>
      <Suspense fallback={<div />}>
        <LazyCodeMirror
          value={notes}
          onChange={(value: string) => {
            setNotes(value);
            replaceAction(value);
          }}
          theme={theme}
        />
      </Suspense>
    </Host>
  );

  // hack: this is hideous. main problem is that the whole
  // action adding stuff does not really work nicely.
  // this needs to be changed big time, but don't really
  // know how for the moment.
  function replaceAction(value: string) {
    const newActions = [...titleActions];

    const index = newActions.findIndex(
      (a) => a.key === editActionKey || a.key === "save"
    );

    const action = {
      label: "Save",
      onClick: () => saveNote(value),
      icon: <SaveOutlined />,
      key: "save",
    };

    if (index === -1) {
      newActions.push(action);
    } else {
      newActions[index] = action;
    }

    setTitleActions(newActions);
  }

  function saveNote(notesValue: string) {
    ServerApi.editMetric(
      metric.id,
      metric.name,
      metric.description,
      notesValue,
      metric.attributes
    )
      .then(() => {
        setAppAlert({
          title: "Saved metric",
          type: "success",
        });

        onSaved(notesValue);

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
