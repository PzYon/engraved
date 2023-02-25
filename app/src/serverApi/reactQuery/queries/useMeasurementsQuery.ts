import { useAppContext } from "../../../AppContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ApiError } from "../../ApiError";
import { IDateConditions } from "../../../components/details/MetricDetailsContext";

export const useMeasurementsQuery = (
  metricId: string,
  dateConditions: IDateConditions,
  attributeValues: { [key: string]: string[] }
) => {
  const { setAppAlert } = useAppContext();

  const { data: measurements } = useQuery({
    queryKey: queryKeysFactory.measurements(
      metricId,
      dateConditions,
      attributeValues
    ),

    queryFn: () =>
      dateConditions
        ? ServerApi.getMeasurements(metricId, attributeValues, dateConditions)
        : Promise.resolve([]),

    onError: (e: ApiError) => {
      setAppAlert({
        title: "Error loading measurements",
        message: e.message,
        type: "error",
      });
    },
  });

  return measurements;
};
