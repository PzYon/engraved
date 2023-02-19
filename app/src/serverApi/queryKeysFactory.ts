import { IDateConditions } from "../components/details/MetricDetailsContext";

export const queryKeysFactory = {
  getMetric: (metricId: string) => {
    return ["metric", metricId];
  },

  getMeasurements: (
    metricId: string,
    dateConditions: IDateConditions,
    attributeValues: { [key: string]: string[] }
  ) => {
    return [
      "metric",
      metricId,
      { filters: { dateConditions, attributeValues } },
    ];
  },

  getSystemInfo: () => {
    return ["system-info"];
  },

  getMetricThresholdValues(
    reloadToken: number,
    metricId: string,
    dateConditions: IDateConditions
  ) {
    return [
      "metric",
      metricId,
      "threshold-values",
      reloadToken,
      dateConditions,
    ];
  },

  updateMeasurement(metricId: string, measurementId: string) {
    return ["metric", metricId, "update", measurementId];
  },

  deleteMeasurement(metricId: string, measurementId: string) {
    return ["metric", metricId, "delete", measurementId];
  },

  getActiveMeasurement(metricId: string) {
    return ["metric", metricId, "active-measurement"];
  },
};
