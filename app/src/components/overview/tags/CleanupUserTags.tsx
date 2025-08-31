import { useState } from "react";
import { useCleanupTagsMutation } from "../../../serverApi/reactQuery/mutations/useCleanupTagsMutation";
import { Button } from "@mui/material";

export const CleanupUserTags: React.FC = () => {
  const [isDryRun, setIsDryRun] = useState(true);

  const { mutate, data, isPending } = useCleanupTagsMutation();

  const nothingToClean = !data?.journalIdsToRemove?.length;

  return (
    <Button
      variant={"contained"}
      disabled={isPending || (data && nothingToClean)}
      onClick={() => {
        mutate({ isDryRun });
        setIsDryRun(false);
      }}
    >
      {getButtonLabel()}
    </Button>
  );

  function getButtonLabel() {
    if (isDryRun || !data) {
      return "Check for deleted (but still referenced) journals";
    }

    if (nothingToClean) {
      return "There is nothing to clean";
    }

    return `Remove ${data.journalIdsToRemove.length} deleted journal(s)`;
  }
};
