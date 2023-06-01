import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { MetricTypeSelector } from "../../MetricTypeSelector";
import { MetricType } from "../../../serverApi/MetricType";

export const PageMetricTypesSelector: React.FC = () => {
  const { metricTypes, setMetricTypes } = usePageContext();

  return (
    <MetricTypeSelector
      margin="dense"
      allowMultiple={true}
      metricType={metricTypes}
      onChange={(types: MetricType | MetricType[]) =>
        setMetricTypes(types as MetricType[])
      }
    />
  );
};
