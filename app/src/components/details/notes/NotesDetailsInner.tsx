import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useAppContext } from "../../../AppContext";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";
import { Route, Routes } from "react-router-dom";
import { Markdown } from "./Markdown";
import { MarkdownEditor } from "./MarkdownEditor";

export const NotesDetailsInner: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { setTitleActions } = useAppContext();

  useEffect(() => {
    setTitleActions(getMetricHeaderActions(metric));

    return () => {
      setTitleActions([]);
    };
  }, [metric]);

  return (
    <Routes>
      <Route path="/" element={<Markdown value={metric.notes} />} />
      <Route path="/edit" element={<MarkdownEditor metric={metric} />} />
    </Routes>
  );
};
