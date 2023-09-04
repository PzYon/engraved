import React, { createContext, useContext, useMemo, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { IMetric } from "../../serverApi/IMetric";
import { useMetricQuery } from "../../serverApi/reactQuery/queries/useMetricQuery";
import { useMeasurementsQuery } from "../../serverApi/reactQuery/queries/useMeasurementsQuery";

export interface IDateConditions {
  from?: Date;
  to?: Date;
}

export interface IMetricContext {
  metric: IMetric;
  measurements: IMeasurement[];
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string
  ) => void;
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[]
  ) => void;
  selectedAttributeValues: Record<string, string[]>;
  setDateConditions: (conditions: IDateConditions) => void;
  dateConditions: IDateConditions;
}

const MetricContext = createContext<IMetricContext>({
  metric: null,
  measurements: [],
  toggleAttributeValue: null,
  setSelectedAttributeValues: null,
  selectedAttributeValues: {},
  setDateConditions: null,
  dateConditions: {},
});

export const useMetricContext = () => {
  return useContext(MetricContext);
};

export const MetricContextProvider: React.FC<{
  children: React.ReactNode;
  metricId: string;
}> = ({ children, metricId }) => {
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<{
    [key: string]: string[];
  }>({});

  const [dateConditions, setDateConditions] = useState<IDateConditions>(null);

  const metric = useMetricQuery(metricId);

  const measurements = useMeasurementsQuery(
    metricId,
    dateConditions,
    selectedAttributeValues
  );

  const contextValue = useMemo(() => {
    return {
      measurements,
      metric,
      toggleAttributeValue,
      selectedAttributeValues,
      setSelectedAttributeValues: setSelectedAttributeValuesInternal,
      setDateConditions,
      dateConditions,
    };
  }, [measurements, metric, selectedAttributeValues, dateConditions]);

  return (
    <MetricContext.Provider value={contextValue}>
      {children}
    </MetricContext.Provider>
  );

  function setSelectedAttributeValuesInternal(
    attributeKey: string,
    attributeValueKeys: string[]
  ) {
    const selectedValues = { ...selectedAttributeValues };
    selectedValues[attributeKey] = attributeValueKeys;
    setSelectedAttributeValues(selectedValues);
  }

  function toggleAttributeValue(
    attributeKey: string,
    attributeValueKey: string
  ) {
    const selectedValues = { ...selectedAttributeValues };

    if (!selectedValues[attributeKey]) {
      selectedValues[attributeKey] = [];
    }

    const index = selectedValues[attributeKey].indexOf(attributeValueKey);
    if (index > -1) {
      selectedValues[attributeKey].splice(index);
    } else {
      selectedValues[attributeKey].push(attributeValueKey);
    }

    setSelectedAttributeValues(selectedValues);
  }
};
