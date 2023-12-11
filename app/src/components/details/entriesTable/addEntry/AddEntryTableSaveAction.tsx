import React from "react";
import { ActionIconButton } from "../../../common/actions/ActionIconButton";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { useUpsertEntryMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { styled } from "@mui/material";
import { IJournal } from "../../../../serverApi/IJournal";

export const AddEntryTableSaveAction: React.FC<{
  command: IUpsertGaugeEntryCommand;
  journal: IJournal;
  onAdded: (lastSelectedDate: Date) => void;
}> = ({ command, journal, onAdded }) => {
  const upsertEntryMutation = useUpsertEntryMutation(
    journal.id,
    journal.type,
    journal,
    null,
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
