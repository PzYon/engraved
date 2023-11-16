import {
  getAllExceptOwner,
  getOwner,
  IUserPermissions,
} from "../../serverApi/IUserPermissions";
import { useAppContext } from "../../AppContext";
import { useMemo } from "react";

export const useJournalPermissions = (permissions: IUserPermissions) => {
  const { user } = useAppContext();

  return useMemo(() => {
    const owner = getOwner(permissions);
    return {
      owner: owner,
      allExceptOwner: getAllExceptOwner(permissions),
      userId: user.id,
      userIsOwner: owner?.id === user.id,
    };
  }, [user, permissions]);
};
