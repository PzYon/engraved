import { useMetricContext } from "../../../components/details/MetricDetailsContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useMetricThresholdsValuesQuery = (metricId: string) => {
  const { dateConditions } = useMetricContext();

  const { data: thresholdValues } = useQuery({
    queryKey: queryKeysFactory.metricThresholdValues(metricId, dateConditions),

    queryFn: () => {
      return dateConditions
        ? ServerApi.getThresholdValues(metricId, dateConditions)
        : Promise.resolve({});
    },
  });

  return thresholdValues;
};
