import { IDateConditions } from "../components/details/MetricDetailsContext";

export const queryKeysFactory = {
  getMetrics() {
    return ["metrics"];
  },

  getMetric(metricId: string) {
    return ["metrics", metricId];
  },

  getMeasurements(
    metricId: string,
    dateConditions: IDateConditions,
    attributeValues: { [key: string]: string[] }
  ) {
    return [
      "metrics",
      metricId,
      "measurements",
      { filters: { dateConditions, attributeValues } },
    ];
  },

  getSystemInfo() {
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

  editMetric(metricId: string) {
    return ["metrics", metricId, "edit"];
  },

  updateMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "measurement", "update", measurementId];
  },

  deleteMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "measurement", "delete", measurementId];
  },

  getActiveMeasurement(metricId: string) {
    return ["metrics", metricId, "measurement", "get-active"];
  },
};
