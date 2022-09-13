import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { IApiError } from "../../serverApi/IApiError";
import { useAppContext } from "../../AppContext";

export interface IDateConditions {
  from?: Date;
  to?: Date;
}

export interface IMetricDetailsContext {
  metric: IMetric;
  measurements: IMeasurement[];
  reloadMetric: () => Promise<void>;
  reloadMeasurements: () => Promise<void>;
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string
  ) => void;
  selectedAttributeValues: { [key: string]: string[] };
  setDateConditions: (conditions: IDateConditions) => void;
  dateConditions: IDateConditions;
}

const MetricDetailsContext = createContext<IMetricDetailsContext>({
  metric: null,
  measurements: [],
  reloadMetric: null,
  reloadMeasurements: null,
  toggleAttributeValue: null,
  selectedAttributeValues: {},
  setDateConditions: null,
  dateConditions: {},
});

export const useMetricDetailsContext = () => {
  return useContext(MetricDetailsContext);
};

export const MetricDetailsContextProvider: React.FC<{
  children: React.ReactNode;
  metricId: string;
}> = ({ children, metricId }) => {
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [metric, setMetric] = useState<IMetric>(null);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<{
    [key: string]: string[];
  }>({});
  const [dateConditions, setDateConditions] = useState<IDateConditions>({});

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    console.log("LOADING MEASUREMENTS");
    getMeasurements().then(setMeasurements);
  }, [metricId, selectedAttributeValues, dateConditions]);

  useEffect(() => {
    reloadMetric();
  }, [metricId]);

  const contextValue = useMemo(() => {
    return {
      measurements,
      metric,
      reloadMetric,
      reloadMeasurements,
      toggleAttributeValue,
      selectedAttributeValues,
      setDateConditions,
      dateConditions,
    };
  }, [measurements, metric, selectedAttributeValues, dateConditions]);

  return (
    <MetricDetailsContext.Provider value={contextValue}>
      {children}
    </MetricDetailsContext.Provider>
  );

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

  function reloadMetric(): Promise<void> {
    return ServerApi.getMetric(metricId)
      .then(setMetric)
      .catch((e) => handleError(`Error loading Metric ${metricId}`, e));
  }

  function reloadMeasurements(): Promise<void> {
    return getMeasurements().then(setMeasurements);
  }

  function getMeasurements(): Promise<IMeasurement[]> {
    return ServerApi.getMeasurements(
      metricId,
      selectedAttributeValues,
      dateConditions
    )
      .then((m) => m)
      .catch((e) => {
        handleError("Error loading measurements", e);
        return [];
      });
  }

  function handleError(title: string, error: Error | IApiError) {
    setAppAlert({
      title: title,
      message: error.message,
      type: "error",
    });
  }
};
