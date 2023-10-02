import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../IEntry";
import { JournalType } from "../../JournalType";

export interface IVariables {
  command: IUpsertEntryCommand;
}

export const useUpsertMeasurementMutation = (
  metricId: string,
  metricType: JournalType,
  measurementId?: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metricId, measurementId),

    mutationFn: async (variables: IVariables) => {
      await ServerApi.upsertEntry(variables.command, metricType.toLowerCase());
    },

    onSuccess: async (_: unknown, variables: IVariables) => {
      setAppAlert({
        title: `${measurementId ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      if (measurementId) {
        updateExistingMeasurementInCache(variables.command);
      }

      await queryClient.invalidateQueries(queryKeysFactory.journal(metricId));
      await queryClient.invalidateQueries(queryKeysFactory.journals());
      await queryClient.invalidateQueries(queryKeysFactory.activities());
    },

    onError: (error: unknown) => {
      setAppAlert({
        title: "Failed to upsert measurementId",
        message: error.toString(),
        type: "error",
      });
    },
  });

  function updateExistingMeasurementInCache(command: IUpsertEntryCommand) {
    queryClient.setQueryData(
      queryKeysFactory.entries(metricId),
      (measurements: IEntry[]) => {
        if (!measurements) {
          return measurements;
        }

        return measurements.map((m) =>
          m.id === measurementId ? createCacheMeasurement(m, command) : m,
        );
      },
    );
  }

  function createCacheMeasurement(
    measurement: IEntry,
    command: IUpsertEntryCommand,
  ) {
    const editedOn = new Date().toString();
    return {
      ...measurement,
      ...command,
      dateTime: editedOn,
      editedOn: editedOn,
    };
  }
};
