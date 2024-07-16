import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { useSearchParams } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
  giveFocus?: () => void;
}> = ({ entry, giveFocus }) => {
  const [searchParams] = useSearchParams();

  const actionKey = searchParams.get("action-key");
  const actionItemId = searchParams.get("action-item-id");

  if (actionItemId === entry.id) {
    return null;
  }

  switch (actionKey) {
    case "delete":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <DeleteEntryAction entry={entry} />
        </NavigationActionContainer>
      );

    case "schedule":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <EditScheduleAction entry={entry} />
        </NavigationActionContainer>
      );

    case "notification-done":
      return (
        <NavigationActionContainer
          shrinkWidthIfPossible={true}
          giveFocus={giveFocus}
        >
          <NotificationDoneAction entry={entry} journal={null} />
        </NavigationActionContainer>
      );

    case "move":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <MoveScrapAction entry={entry as IScrapEntry} />
        </NavigationActionContainer>
      );

    case "edit":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <UpsertEntryAction entry={entry} />
        </NavigationActionContainer>
      );

    default:
      return null;
  }
};
