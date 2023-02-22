import React, { createContext, useContext, useMemo, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { useAppContext } from "../../AppContext";
import { getDefaultDateConditions } from "./filters/DateFilters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../../serverApi/queryKeysFactory";
import { ApiError } from "../../serverApi/ApiError";

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
  selectedAttributeValues: { [key: string]: string[] };
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

  const [dateConditions, setDateConditions] = useState<IDateConditions>(() =>
    getDefaultDateConditions()
  );

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

export const useMetricQuery = (metricId: string) => {
  const queryClient = useQueryClient();

  const { data: metric } = useQuery({
    queryKey: queryKeysFactory.metric(metricId),

    queryFn: () => ServerApi.getMetric(metricId),

    onSuccess: (loadedMetric) => {
      queryClient.setQueriesData(
        { queryKey: queryKeysFactory.metrics(), exact: true },
        (metrics: IMetric[]) =>
          metrics.map((m) => (m.id === loadedMetric.id ? loadedMetric : m))
      );
    },
  });

  return metric;
};

export const useMeasurementsQuery = (
  metricId: string,
  dateConditions: IDateConditions,
  attributeValues: { [key: string]: string[] }
) => {
  const { setAppAlert } = useAppContext();

  const { data: measurements } = useQuery({
    queryKey: queryKeysFactory.measurements(
      metricId,
      dateConditions,
      attributeValues
    ),

    queryFn: () =>
      ServerApi.getMeasurements(metricId, attributeValues, dateConditions),

    onError: (e: ApiError) => {
      setAppAlert({
        title: "Error loading measurements",
        message: e.message,
        type: "error",
      });
    },
  });

  return measurements;
};
