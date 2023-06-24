import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpdatePermissions } from "../../IUpdatePermissions";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";

export const useModifyMetricPermissionsMutation = (metricId: string) => {
  const { setAppAlert } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.metric(metricId),

    mutationFn: (variables: { newPermissions: IUpdatePermissions }) =>
      ServerApi.modifyMetricPermissions(metricId, variables.newPermissions),

    onSuccess: () =>
      setAppAlert({
        title: `Modified metric permissions`,
        type: "success",
      }),

    onError: (error: IAppAlert) =>
      setAppAlert({
        title: "Failed to modify metric permissions",
        message: error.message,
        type: "error",
      }),
  });
};
