import { useState } from "react";
import { useCleanupTagsMutation } from "../../../serverApi/reactQuery/mutations/useCleanupTagsMutation";
import { Button } from "@mui/material";

export const CleanupUserTags: React.FC = () => {
  const [isDryRun, setIsDryRun] = useState(true);

  const { mutate, data, isPending } = useCleanupTagsMutation(isDryRun);

  const nothingToClean = !data?.journalIdsToRemove?.length;
  return (
    <Button
      disabled={isPending || (data && nothingToClean)}
      onClick={() => {
        mutate();
        setIsDryRun(false);
      }}
    >
      {isDryRun || !data
        ? "Check for unused tags"
        : nothingToClean
          ? "Nothing to clean"
          : `Cleanup ${data.journalIdsToRemove.length} unused tag(s)`}
    </Button>
  );
};
