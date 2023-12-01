import React from "react";
import { ActionIconButton } from "../../../common/actions/ActionIconButton";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { useUpsertEntryMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../../serverApi/JournalType";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { styled } from "@mui/material";

export const AddEntryTableSaveAction: React.FC<{
  command: IUpsertGaugeEntryCommand;
  journalType: JournalType;
  onAdded: (lastSelectedDate: Date) => void;
}> = ({ command, journalType, onAdded }) => {
  const upsertEntryMutation = useUpsertEntryMutation(
    command.journalId,
    journalType,
    "",
    () => onAdded(command.dateTime),
  );

  return (
    <Host>
      <ActionIconButton
        action={ActionFactory.save(
          async () => {
            await upsertEntryMutation.mutateAsync({
              command: command,
            });
          },
          false,
          true,
        )}
      />
    </Host>
  );
};

const Host = styled("div")`
  display: inline-block;
  padding-top: 10px;
`;
