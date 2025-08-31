import { useCleanupTagsMutation } from "../../../serverApi/reactQuery/mutations/useCleanupTagsMutation";

export const CleanupUserTags: React.FC = () => {
  const cleanupMutation = useCleanupTagsMutation();

  return <div onClick={() => cleanupMutation.mutate()}>cleanup user tags</div>;
};
