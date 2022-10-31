import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../AppContext";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";
import { Route, Routes } from "react-router-dom";
import { Markdown } from "./Markdown";
import { MarkdownEditor } from "./MarkdownEditor";
import { DetailsSection } from "../../layout/DetailsSection";
import { useMetricDetailsContext } from "../MetricDetailsContext";

export const NotesDetailsContent: React.FC = () => {
  const { metric, reloadMetric } = useMetricDetailsContext();

  const { setTitleActions } = useAppContext();

  const [notes, setNotes] = useState(metric.notes);

  useEffect(() => {
    setTitleActions(getMetricHeaderActions(metric));

    return () => {
      setTitleActions([]);
    };
  }, [metric]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DetailsSection>
            <Markdown value={notes} />
          </DetailsSection>
        }
      />
      <Route
        path="/edit"
        element={
          <MarkdownEditor
            metric={metric}
            onSaved={(value) => {
              setNotes(value);
              reloadMetric();
            }}
          />
        }
      />
    </Routes>
  );
};
