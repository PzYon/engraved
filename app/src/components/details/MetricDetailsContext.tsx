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
import { hasValues } from "../../util/MeasurementUtil";

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
}

const MetricDetailsContext = createContext<IMetricDetailsContext>({
  metric: null,
  measurements: [],
  reloadMetric: null,
  reloadMeasurements: null,
  toggleAttributeValue: null,
  selectedAttributeValues: {},
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

  const [allMeasurements, setAllMeasurements] = useState<IMeasurement[]>([]);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    getMeasurements().then((m) => {
      setAllMeasurements(m);
      setMeasurements(m);
    });

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
    };
  }, [measurements, metric, selectedAttributeValues]);

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

    const newMeasurements = allMeasurements.filter((measurement) =>
      hasValues(measurement.metricAttributeValues, selectedValues)
    );

    setMeasurements(newMeasurements);
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
    return ServerApi.getMeasurements(metricId)
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
