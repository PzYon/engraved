/**
 * EXAMPLE: How to add scoped hotkeys to JournalListItem
 *
 * This file shows how to update the JournalListItem component to use scoped hotkeys,
 * ensuring that keyboard shortcuts only work on the currently focused journal item.
 *
 * BEFORE (current implementation):
 * - All journal items have the same hotkeys (alt+e, alt+d, etc.)
 * - Pressing a hotkey triggers ALL items with that hotkey
 * - No way to target just the focused item
 *
 * AFTER (with scoped hotkeys):
 * - Each journal item has its own scope
 * - Hotkeys only work on the focused item
 * - Other items ignore the hotkey
 */

import React, { useRef } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Box, styled } from "@mui/material";
import { useJournalProperties } from "./useJournalProperties";
import { getCommonJournalActions } from "../getCommonJournalActions";
import { ListItemFooterRow } from "../ListItemFooterRow";
import { ReadonlyTitle } from "../ReadonlyTitle";
import { useAppContext } from "../../../AppContext";
import { JournalSubRoutes } from "./JournalSubRoutes";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IconStyle } from "../../common/IconStyle";
import { JournalIcon } from "./JournalIcon";
// ADD THESE IMPORTS:
import { createItemScope } from "../../common/actions/scopeUtils";
import { useScopedFocus } from "../../common/actions/useScopedFocus";

export const JournalListItemWithScopes: React.FC<{
  journal: IJournal;
  index: number;
  hasFocus?: boolean;
}> = ({ journal, index, hasFocus }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { user } = useAppContext();

  const journalProperties = useJournalProperties(journal);

  // STEP 1: Create a unique scope for this journal item
  const scope = createItemScope("journal", journal.id);

  // STEP 2: Enable/disable the scope based on focus
  useScopedFocus(scope, hasFocus);

  return (
    <div ref={domElementRef} data-testid={`journals-list-item-${index}`}>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            flexGrow: 1,
            wordBreak: "break-all",
          }}
        >
          <TitleRow>
            <IconContainer>
              <JournalIcon journal={journal} iconStyle={IconStyle.Small} />
            </IconContainer>
            <ReadonlyTitle
              entity={journal}
              title={journal.name}
              hasFocus={hasFocus}
              onClickAction={ActionFactory.goToJournal(journal.id, hasFocus)}
            />
          </TitleRow>
          <ListItemFooterRow
            hasFocus={hasFocus}
            properties={journalProperties}
            // STEP 3: Pass the scope to the actions
            // NOTE: This won't compile until you update getCommonJournalActions to accept a scope parameter
            // See the example implementation below for how to update that function
            // @ts-expect-error - Example code showing the updated signature
            actions={getCommonJournalActions(journal, hasFocus, user, scope)}
          />
          {hasFocus ? <JournalSubRoutes journal={journal} /> : null}
        </Box>
      </Box>
    </div>
  );
};

const TitleRow = styled("div")`
  display: flex;
`;

const IconContainer = styled("span")`
  padding-top: 5px;
  padding-right: ${(p) => p.theme.spacing(2)};
  display: flex;
  align-items: center;
`;

/**
 * STEP 4: Update getCommonJournalActions to accept and use scope
 *
 * In getCommonJournalActions.tsx, update the function signature:
 *
 * export function getCommonJournalActions(
 *   journal: IJournal,
 *   enableHotkeys: boolean,
 *   user: IUser,
 *   scope?: string | string[],  // <-- ADD THIS PARAMETER
 * ): IAction[] {
 *   if (!journal) {
 *     return [];
 *   }
 *
 *   const actions: IAction[] = [
 *     ActionFactory.addEntry(journal, enableHotkeys, undefined, undefined, scope),
 *     ActionFactory.editJournalPermissions(journal.id),
 *     ActionFactory.editJournalSchedule(
 *       journal.id,
 *       enableHotkeys,
 *       !!getScheduleForUser(journal, user.id).nextOccurrence,
 *       scope,
 *     ),
 *   ];
 *
 *   actions.push(
 *     ActionFactory.editJournal(journal.id, enableHotkeys, scope),
 *     ActionFactory.deleteJournal(journal.id, enableHotkeys, scope),
 *   );
 *
 *   return actions;
 * }
 */

/**
 * STEP 5: Update ActionFactory methods to accept scope
 *
 * In ActionFactory.tsx, update each method to accept an optional scope parameter:
 *
 * static editJournal(
 *   journalId: string,
 *   enableHotkey: boolean,
 *   scope?: string | string[],  // <-- ADD THIS PARAMETER
 * ): IAction {
 *   return {
 *     hotkey: enableHotkey ? "alt+e" : undefined,
 *     scope: scope,  // <-- USE THE SCOPE
 *     key: "edit",
 *     label: "Edit journal",
 *     icon: <EditOutlined fontSize="small" />,
 *     search: getItemActionQueryParams("edit", journalId),
 *   };
 * }
 *
 * static deleteJournal(
 *   journalId: string,
 *   enableHotkeys: boolean,
 *   scope?: string | string[],  // <-- ADD THIS PARAMETER
 * ): IAction {
 *   return {
 *     hotkey: enableHotkeys ? "alt+d" : undefined,
 *     scope: scope,  // <-- USE THE SCOPE
 *     key: "delete",
 *     label: "Delete journal",
 *     icon: <DeleteOutlined fontSize="small" />,
 *     search: getItemActionQueryParams("delete", journalId),
 *   };
 * }
 */
