import { IJournal } from "../../../serverApi/IJournal";
import { DeleteJournalAction } from "../../details/edit/DeleteJournalAction";
import { EditJournalPermissionsAction } from "../../details/edit/EditJournalPermissionsAction";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import {
  knownQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { NavigationActionContainer } from "../../common/actions/NavigationActionContainer";
import { JournalType } from "../../../serverApi/JournalType";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { getParams } = useItemAction();

  if (getParams()[knownQueryParams.selectedItemId] !== journal.id) {
    return null;
  }

  switch (getParams()[knownQueryParams.actionKey]) {
    case "delete":
      return (
        <NavigationActionContainer>
          <DeleteJournalAction journal={journal} />
        </NavigationActionContainer>
      );

    case "permissions":
      return (
        <NavigationActionContainer>
          <EditJournalPermissionsAction journal={journal} />
        </NavigationActionContainer>
      );

    case "schedule":
      return (
        <NavigationActionContainer>
          <EditScheduleAction journal={journal} />
        </NavigationActionContainer>
      );

    case "add-entry":
      return (
        <NavigationActionContainer
          growWidthIfPossible={journal.type === JournalType.Scraps}
        >
          <UpsertEntryAction journal={journal} />
        </NavigationActionContainer>
      );

    default:
      return null;
  }
};
