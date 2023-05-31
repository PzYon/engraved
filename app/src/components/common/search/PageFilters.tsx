import { SearchBox } from "./SearchBox";
import React from "react";
import { MetricTypeSelector } from "../../MetricTypeSelector";
import { MetricType } from "../../../serverApi/MetricType";
import { usePageContext } from "../../layout/pages/PageContext";

export const PageFilters: React.FC = () => {
  return (
    <>
      <SearchBox />
      <PageMetricTypesSelector />
    </>
  );
};

export const PageMetricTypesSelector: React.FC = () => {
  const { metricTypes, setMetricTypes } = usePageContext();

  return (
    <MetricTypeSelector
      allowMultiple={true}
      metricType={metricTypes}
      onChange={(types: MetricType | MetricType[]) =>
        setMetricTypes(types as MetricType[])
      }
    />
  );
};
