import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { MetricType } from "../../MetricType";
import { ServerApi } from "../../ServerApi";
import { IMetric } from "../../IMetric";

export const useActiveMeasurementQuery = (metric: IMetric) => {
  const { data: measurement } = useQuery({
    queryKey: queryKeysFactory.activeMeasurement(metric.id),

    queryFn: () =>
      metric.type === MetricType.Timer
        ? ServerApi.getActiveMeasurement(metric.id)
        : Promise.resolve(null),
  });

  return measurement;
};
