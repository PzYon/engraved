import { IJournal } from "../../../serverApi/IJournal";
import { DeleteJournalAction } from "../../details/edit/DeleteJournalAction";
import { EditJournalPermissionsAction } from "../../details/edit/EditJournalPermissionsAction";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { useOpenActionKey } from "../../common/actions/searchParamHooks";
import { NavigationActionContainer } from "../../common/actions/NavigationActionContainer";
import { JournalType } from "../../../serverApi/JournalType";
import { RelatedItemsAction } from "../../details/related/RelatedItemsAction";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const openActionKey = useOpenActionKey(journal.id);

  switch (openActionKey) {
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

    case "related":
      return (
        <NavigationActionContainer>
          <RelatedItemsAction
            entityId={journal.id ?? ""}
            entityType="Journal"
          />
        </NavigationActionContainer>
      );

    case "add-entry":
      return (
        <NavigationActionContainer
          growWidthIfPossible={
            journal.type === JournalType.Scraps ||
            journal.type === JournalType.LogBook
          }
        >
          <UpsertEntryAction journal={journal} />
        </NavigationActionContainer>
      );

    default:
      return null;
  }
};
