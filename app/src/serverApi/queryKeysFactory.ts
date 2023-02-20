import { IDateConditions } from "../components/details/MetricDetailsContext";

export const queryKeysFactory = {
  metrics() {
    return ["metrics"];
  },

  metric(metricId: string) {
    return ["metrics", metricId];
  },

  measurements(
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

  systemInfo() {
    return ["system-info"];
  },

  metricThresholdValues(metricId: string, dateConditions: IDateConditions) {
    return ["metrics", metricId, "threshold-values", dateConditions];
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

  activeMeasurement(metricId: string) {
    return ["metrics", metricId, "measurements", "get-active"];
  },
};
