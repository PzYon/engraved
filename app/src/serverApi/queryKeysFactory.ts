import { IDateConditions } from "../components/details/MetricDetailsContext";

export const queryKeysFactory = {
  metrics() {
    return ["metrics"];
  },

  metric(metricId: string) {
    return ["metrics", metricId];
  },

  editMetric(metricId: string) {
    return ["metrics", metricId, "edit"];
  },

  deleteMetric(metricId: string) {
    return ["metrics", metricId, "delete"];
  },

  metricThresholdValues(metricId: string, dateConditions: IDateConditions) {
    return ["metrics", metricId, "threshold-values", dateConditions];
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

  updateMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "measurement", "update", measurementId];
  },

  deleteMeasurement(metricId: string, measurementId: string) {
    return ["metrics", metricId, "measurement", "delete", measurementId];
  },

  activeMeasurement(metricId: string) {
    return ["metrics", metricId, "measurements", "get-active"];
  },

  systemInfo() {
    return ["system-info"];
  },
};
