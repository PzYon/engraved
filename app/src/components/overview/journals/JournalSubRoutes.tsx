import { IJournal } from "../../../serverApi/IJournal";
import { DeleteJournalAction } from "../../details/edit/DeleteJournalAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { EditJournalPermissionsAction } from "../../details/edit/EditJournalPermissionsAction";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import {
  knownQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { NavigationActionContainer } from "../../common/entries/NavigationActionContainer";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
  giveFocus?: () => void;
}> = ({ journal, giveFocus }) => {
  const { getParams } = useItemAction();

  if (getParams()[knownQueryParams.selectedItemIdParam] !== journal.id) {
    return null;
  }

  switch (getParams()[knownQueryParams.actionKey]) {
    case "delete":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <DeleteJournalAction journal={journal} />
        </NavigationActionContainer>
      );

    case "permissions":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <EditJournalPermissionsAction journal={journal} />
        </NavigationActionContainer>
      );

    case "notification-done":
      return (
        <NavigationActionContainer
          shrinkWidthIfPossible={true}
          giveFocus={giveFocus}
        >
          <NotificationDoneAction entry={null} journal={journal} />
        </NavigationActionContainer>
      );

    case "schedule":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <EditScheduleAction journal={journal} />
        </NavigationActionContainer>
      );

    case "add-entry":
      return (
        <NavigationActionContainer
          growWidthIfPossible={true}
          giveFocus={giveFocus}
        >
          <UpsertEntryAction journal={journal} />
        </NavigationActionContainer>
      );

    default:
      return null;
  }
};
