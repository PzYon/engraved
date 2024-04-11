import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { Button } from "@mui/material";
import { DialogFormButtonContainer } from "../common/FormButtonContainer";
import { useModifyScheduleMutation } from "../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { useAppContext } from "../../AppContext";
import { ISchedule } from "../../serverApi/ISchedule";
import { parseDate } from "./edit/parseDate";
import { useNavigate } from "react-router-dom";

export const NotificationDone: React.FC<{
  journal: IJournal;
  entry?: IEntry;
  onSuccess: () => void;
}> = ({ journal, entry, onSuccess }) => {
  const { user } = useAppContext();

  const navigate = useNavigate();

  const modifyScheduleMutation = useModifyScheduleMutation(
    journal.id,
    entry?.id,
  );

  const schedule: ISchedule = (entry ? entry.schedules : journal.schedules)?.[
    user.id
  ];

  return (
    <div>
      <DialogFormButtonContainer>
        <Button
          variant={"contained"}
          onClick={() => {
            modifyScheduleMutation.mutate({
              nextOccurrence: schedule.recurrence
                ? parseDate(schedule.recurrence.dateString).date
                : null,
            });
            onSuccess();
          }}
        >
          Mark {entry ? "entry" : "journal"} as done
        </Button>
        <Button
          variant={"contained"}
          onClick={() => {
            navigate(
              entry
                ? `/journals/${entry.parentId}/entries/${entry.id}/delete`
                : `/journals/${entry.parentId}/delete`,
            );
          }}
        >
          Delete {entry ? "entry" : "journal"}
        </Button>
      </DialogFormButtonContainer>
    </div>
  );
};
