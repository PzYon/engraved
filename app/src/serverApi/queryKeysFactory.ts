import { IDateConditions } from "../components/details/MetricDetailsContext";

export const queryKeysFactory = {
  getMetrics() {
    return ["metrics"];
  },

  getMetric: (metricId: string) => {
    return ["metrics", metricId];
  },

  getMeasurements: (
    metricId: string,
    dateConditions: IDateConditions,
    attributeValues: { [key: string]: string[] }
  ) => {
    return [
      "metrics",
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
      "metrics",
      metricId,
      "threshold-values",
      reloadToken,
      dateConditions,
    ];
  },

  updateMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "update", measurementId];
  },

  deleteMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "delete", measurementId];
  },

  getActiveMeasurement(metricId: string) {
    return ["metrics", metricId, "active-measurement"];
  },
};
