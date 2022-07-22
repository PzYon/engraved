import React, { createContext, useContext, useEffect, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { IApiError } from "../../serverApi/IApiError";
import { useAppContext } from "../../AppContext";

export interface IMetricDetailsContext {
  metric: IMetric;
  measurements: IMeasurement[];
  reloadMetric: () => Promise<void>;
  reloadMeasurements: () => Promise<void>;
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string
  ) => void;
}

const MetricDetailsContext = createContext<IMetricDetailsContext>({
  metric: null,
  measurements: [],
  reloadMetric: null,
  reloadMeasurements: null,
  toggleAttributeValue: null,
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
  const [togglers, setTogglers] = useState<{ [key: string]: string[] }>({});

  const [allMeasurements, setAllMeasurements] = useState<IMeasurement[]>([]);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    getMeasurements().then((m) => {
      setAllMeasurements(m);
      setMeasurements(m);
    });

    reloadMetric();
  }, [metricId]);

  return (
    <MetricDetailsContext.Provider
      value={{
        measurements,
        metric,
        reloadMetric,
        reloadMeasurements,
        toggleAttributeValue,
      }}
    >
      {children}
    </MetricDetailsContext.Provider>
  );

  function toggleAttributeValue(
    attributeKey: string,
    attributeValueKey: string
  ) {
    const newTogglers = { ...togglers };

    if (!newTogglers[attributeKey]) {
      newTogglers[attributeKey] = [];
    }

    const index = newTogglers[attributeKey].indexOf(attributeValueKey);
    if (index > -1) {
      newTogglers[attributeKey].splice(index);
    } else {
      newTogglers[attributeKey].push(attributeValueKey);
    }

    const newMeasurements = allMeasurements.filter((m) => {
      const keysWithValues = Object.keys(newTogglers).filter(
        (key) => newTogglers[key]?.length
      );

      for (const k of keysWithValues) {
        if (m.metricAttributeValues[k]?.indexOf(attributeValueKey) === -1) {
          return false;
        }
      }

      return true;
    });

    setMeasurements(newMeasurements);
    setTogglers(newTogglers);
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
