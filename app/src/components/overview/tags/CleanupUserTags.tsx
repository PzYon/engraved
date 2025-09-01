import { useState } from "react";
import { useCleanupTagsMutation } from "../../../serverApi/reactQuery/mutations/useCleanupTagsMutation";
import { Button } from "@mui/material";
import { useAppContext } from "../../../AppContext";

export const CleanupUserTags: React.FC = () => {
  const [isDryRun, setIsDryRun] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const { reloadUser } = useAppContext();

  const { mutate, data, isPending } = useCleanupTagsMutation();

  const nothingToClean = !data?.journalIdsToRemove?.length;

  return (
    <Button
      variant={"contained"}
      disabled={isPending || (data && nothingToClean) || isCompleted}
      onClick={async () => {
        setIsCompleted(false);

        mutate({ isDryRun });

        if (isDryRun) {
          setIsDryRun(false);
        } else {
          await reloadUser();
          setIsCompleted(true);
        }
      }}
    >
      {getButtonLabel()}
    </Button>
  );

  function getButtonLabel() {
    if (isDryRun || !data || isCompleted) {
      return "Check for deleted (but still referenced) journals";
    }

    if (nothingToClean) {
      return "There is nothing to clean";
    }

    return `Remove ${data.journalIdsToRemove.length} deleted journal(s)`;
  }
};
