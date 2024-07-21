import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { useItemAction } from "../actions/itemActionHook";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
  render?: (child: React.ReactElement) => React.ReactElement;
  giveFocus?: () => void;
}> = ({ entry, render, giveFocus }) => {
  const { getParams } = useItemAction();
  const action = getParams();

  if (action["action-item-id"] !== entry.id) {
    return null;
  }

  return render ? render(getChild()) : getChild();

  function getChild() {
    switch (action["action-key"]) {
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
  }
};
