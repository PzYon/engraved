import { IDateConditions } from "../../components/details/MetricDetailsContext";
import { MetricType } from "../MetricType";

const metrics = "metrics";

export const queryKeysFactory = {
  metrics(searchText?: string, metricTypes?: MetricType[]) {
    return [metrics, "all", searchText ?? "", metricTypes?.join() ?? ""];
  },

  metric(metricId: string) {
    return [metrics, metricId];
  },

  addMetric() {
    return [metrics, "add"];
  },

  editMetric(metricId: string) {
    return [metrics, metricId, "edit"];
  },

  deleteMetric(metricId: string) {
    return [metrics, metricId, "delete"];
  },

  metricThresholdValues(metricId: string, dateConditions: IDateConditions) {
    return [metrics, metricId, "threshold-values", dateConditions];
  },

  measurements(
    metricId: string,
    dateConditions?: IDateConditions,
    attributeValues?: { [key: string]: string[] }
  ) {
    return [
      metrics,
      metricId,
      "measurements",
      { filters: { dateConditions: dateConditions, attributeValues } },
    ];
  },

  updateMeasurement(metricId: string, measurementId: string) {
    return [metrics, metricId, "measurement", "update", measurementId];
  },

  deleteMeasurement(metricId: string, measurementId: string) {
    return [metrics, metricId, "measurement", "delete", measurementId];
  },

  moveMeasurement(measurementId: string, metricId: string) {
    return [metrics, metricId, measurementId];
  },

  activeMeasurement(metricId: string, metricType: MetricType) {
    return [metrics, metricId, "measurements", metricType, "get-active"];
  },

  activities(searchText?: string, metricTypes?: MetricType[]) {
    return [metrics, "activities", searchText ?? "", metricTypes?.join() ?? ""];
  },

  systemInfo() {
    return ["system-info"];
  },

  appVersion() {
    return ["app-version"];
  },
};
