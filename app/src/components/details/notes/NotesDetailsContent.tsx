import React, { useEffect, useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useAppContext } from "../../../AppContext";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";
import { Route, Routes } from "react-router-dom";
import { Markdown } from "./Markdown";
import { MarkdownEditor } from "./MarkdownEditor";
import { DetailsSection } from "../../layout/DetailsSection";

export const NotesDetailsContent: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
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
        element={<MarkdownEditor metric={metric} onSaved={setNotes} />}
      />
    </Routes>
  );
};
