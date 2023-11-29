import React from "react";
import { ActionIconButton } from "../../../common/actions/ActionIconButton";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { useUpsertEntryMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../../serverApi/JournalType";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";

export const AddEntryTableSaveAction: React.FC<{
  command: IUpsertGaugeEntryCommand;
  journalType: JournalType;
  onAdded: () => void;
}> = ({ command, journalType, onAdded }) => {
  const upsertEntryMutation = useUpsertEntryMutation(
    command.journalId,
    journalType,
    "",
    () => onAdded(),
  );

  return (
    <ActionIconButton
      action={ActionFactory.save(
        async () => {
          command.dateTime = new Date();
          await upsertEntryMutation.mutateAsync({
            command: command,
          });
        },
        false,
        true,
      )}
    />
  );
};
