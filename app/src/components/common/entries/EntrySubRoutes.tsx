import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { RelatedItemsAction } from "../../details/related/RelatedItemsAction";
import { knownQueryParams, useItemAction } from "../actions/searchParamHooks";
import { NavigationActionContainer } from "../actions/NavigationActionContainer";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
  render?: (child: React.ReactElement) => React.ReactElement;
}> = ({ entry, render }) => {
  const { getParams } = useItemAction();
  const action = getParams();

  if (action[knownQueryParams.selectedItemId] !== entry.id) {
    return null;
  }

  const child = getChild();
  if (!child) return null;
  return render ? render(child) : child;

  function getChild() {
    switch (action[knownQueryParams.actionKey]) {
      case "delete":
        return (
          <NavigationActionContainer>
            <DeleteEntryAction entry={entry} />
          </NavigationActionContainer>
        );

      case "schedule":
        return (
          <NavigationActionContainer>
            <EditScheduleAction entry={entry} />
          </NavigationActionContainer>
        );

      case "move":
        return (
          <NavigationActionContainer>
            <MoveScrapAction entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        );

      case "edit":
        return (
          <NavigationActionContainer>
            <UpsertEntryAction entry={entry} />
          </NavigationActionContainer>
        );

      case "related":
        return (
          <NavigationActionContainer>
            <RelatedItemsAction entityId={entry.id ?? ""} entityType="Entry" />
          </NavigationActionContainer>
        );

      default:
        return null;
    }
  }
};
