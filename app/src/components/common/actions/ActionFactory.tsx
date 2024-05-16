import {
  AddOutlined,
  ClearOutlined,
  Close,
  ContentCopyOutlined,
  DeleteOutlined,
  DoneOutlined,
  EditNotificationsOutlined,
  EditOutlined,
  ExpandLess,
  ExpandMore,
  FilterAltOutlined,
  FormatLineSpacingOutlined,
  FunctionsOutlined,
  Help,
  MessageOutlined,
  NotificationAddOutlined,
  PanToolOutlined,
  PlaylistAdd,
  PlaylistAddOutlined,
  Redo,
  RefreshOutlined,
  SaveOutlined,
  SearchOutlined,
  ShareOutlined,
  ShowChartOutlined,
  SwitchAccessShortcutOutlined,
  Toc,
} from "@mui/icons-material";
import { IJournal } from "../../../serverApi/IJournal";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { renderUpsertEntryDialog } from "../../details/add/renderUpsertEntryDialog";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IEntry } from "../../../serverApi/IEntry";
import { IAppAlert } from "../../errorHandling/AppAlertBar";
import { IUser } from "../../../serverApi/IUser";
import { renderAddScrapDialog } from "../../details/add/renderAddScrapDialog";
import { QueryClient } from "@tanstack/react-query";
import { IAction } from "./IAction";
import { Button, Typography } from "@mui/material";
import { DialogFormButtonContainer } from "../FormButtonContainer";
import { renderAddNewNotificationDialog } from "../../details/add/renderAddNewNotificationDialog";
import { RegisteredActionsList } from "./RegisteredActionsList";
import { NavigateFunction } from "react-router-dom";
import { renderNotificationDone } from "../../details/renderNotificationDone";
import { renderDeleteEntry } from "../../details/edit/renderDeleteEntry";
import { renderEditSchedule } from "../../details/edit/renderEditSchedule";

export class ActionFactory {
  static cancel(onClick: () => void): IAction {
    return {
      key: "cancel",
      label: "Cancel",
      icon: <Close fontSize="small" />,
      onClick: onClick,
    };
  }

  static save(
    onClick: () => Promise<void>,
    isDisabled: boolean,
    enableHotkeys: boolean,
  ): IAction {
    return {
      hotkey: enableHotkeys ? "alt+s" : undefined,
      key: "save",
      label: "Save",
      icon: <SaveOutlined fontSize="small" />,
      onClick: onClick,
      isDisabled: isDisabled,
    };
  }

  static goHome(): IAction {
    return {
      hotkey: "alt+h",
      key: "navigate-home",
      label: "Home",
      href: "/",
      icon: null,
    };
  }

  static goToJournal(journalId: string, enableHotkeys: boolean): IAction {
    return {
      hotkey: enableHotkeys ? "alt+enter" : undefined,
      key: `go-to-journal-${journalId}`,
      href: `/journals/${journalId}`,
      label: "Go to journal",
      icon: null,
    };
  }

  static newJournal(): IAction {
    return {
      hotkey: "alt+n",
      href: "/journals/create",
      icon: <AddOutlined fontSize="small" />,
      label: "Add journal",
      key: "add_journal",
    };
  }

  static editJournal(journalId: string, enableHotkey: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: "edit",
      label: "Edit journal",
      icon: <EditOutlined fontSize="small" />,
      href: `/journals/${journalId}/edit`,
    };
  }

  static editJournalPermissions(journalId: string): IAction {
    return {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined fontSize="small" />,
      href: `/journals/${journalId}/permissions`,
    };
  }

  static deleteJournal(journalId: string, enableHotkeys: boolean): IAction {
    return {
      hotkey: enableHotkeys ? "alt+d" : undefined,
      key: "delete",
      label: "Delete journal",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/journals/${journalId}/delete`,
    };
  }

  static editJournalSchedule(
    journalId: string,
    renderDialog?: (dialogProps: IDialogProps) => void,
    journal?: IJournal,
    enableHotkeys?: boolean,
  ): IAction {
    const additionalProps: Partial<IAction> = renderDialog
      ? {
          onClick: () =>
            renderEditSchedule(journalId, null, journal, renderDialog, null),
        }
      : {
          href: `/journals/${journalId}/schedule`,
        };

    return {
      hotkey: enableHotkeys ? "alt+t" : undefined,
      key: "edit-schedule",
      label: "Edit schedule",
      icon: <EditNotificationsOutlined fontSize="small" />,
      ...additionalProps,
    };
  }

  static editEntryScheduleViaUrl(
    journalId: string,
    entryId: string,
    enableHotKeys?: boolean,
  ) {
    return this.editEntryScheduleInternal(
      {
        href: `/journals/${journalId}/entries/${entryId}/schedule`,
      },
      enableHotKeys,
    );
  }

  static editEntrySchedule(
    journalId: string,
    entryId: string,
    renderDialog: (dialogProps: IDialogProps) => void,
    enableHotKeys?: boolean,
  ) {
    return this.editEntryScheduleInternal(
      {
        onClick: () =>
          renderEditSchedule(journalId, entryId, null, renderDialog),
      },
      enableHotKeys,
    );
  }

  private static editEntryScheduleInternal(
    additionalProps: Partial<IAction>,
    enableHotkeys?: boolean,
  ): IAction {
    return {
      key: "edit-schedule",
      hotkey: enableHotkeys ? "alt+s" : undefined,
      label: "Edit schedule",
      icon: <EditNotificationsOutlined fontSize="small" />,
      ...additionalProps,
    };
  }

  static addEntry(
    journal: IJournal,
    renderDialog: (dialogProps: IDialogProps) => void,
    enableHotkey: boolean,
    additionalOnClick?: () => void,
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+a" : undefined,
      key: "add_entry",
      label: "Add entry",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => {
        additionalOnClick?.();
        renderUpsertEntryDialog(journal, renderDialog);
      },
    };
  }

  static getToc(onClick: () => void): IAction {
    return {
      key: "toc",
      hotkey: "alt+i",
      label: "Table of contents",
      icon: <Toc fontSize="small" />,
      onClick: onClick,
    };
  }

  static toggleAddNewEntryRow(
    showAddNewEntryRow: boolean,
    setShowAddNewEntryRow: (value: boolean) => void,
  ): IAction {
    return {
      key: "show_add_entry_row",
      hotkey: "alt+t",
      icon: <PlaylistAdd fontSize="small" />,
      label: "Show add new entry row",
      onClick: () => setShowAddNewEntryRow(!showAddNewEntryRow),
      isNotActive: !showAddNewEntryRow,
    };
  }

  static toggleNotes(
    showNotes: boolean,
    setShowNotes: (value: boolean) => void,
  ): IAction {
    return {
      key: "notes",
      icon: <MessageOutlined fontSize="small" />,
      label: "Show notes",
      onClick: () => setShowNotes(!showNotes),
      isNotActive: !showNotes,
    };
  }

  static toggleShowChart(
    showChart: boolean,
    setShowChart: (value: boolean) => void,
  ): IAction {
    return {
      key: "chart",
      icon: <ShowChartOutlined fontSize="small" />,
      label: "Show chart",
      onClick: () => setShowChart(!showChart),
      isNotActive: !showChart,
    };
  }

  static toggleFilters(
    showFilters: boolean,
    setShowFilters: (v: boolean) => void,
    enableHotkey: boolean,
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+f" : undefined,
      key: "filters",
      icon: <FilterAltOutlined fontSize="small" />,
      label: "Show filters",
      isNotActive: !showFilters,
      onClick: () => setShowFilters(!showFilters),
    };
  }

  static toggleGroupTotals(
    showGroupTotals: boolean,
    setShowGroupTotals: (value: boolean) => void,
  ): IAction {
    return {
      key: "groupTotals",
      icon: <FunctionsOutlined fontSize="small" />,
      label: "Show group aggregations",
      onClick: () => setShowGroupTotals(!showGroupTotals),
      isNotActive: !showGroupTotals,
    };
  }

  static editScrap(onEdit: () => void, enableHotkey: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: "edit",
      label: "Edit scrap",
      icon: <EditOutlined fontSize="small" />,
      onClick: onEdit,
    };
  }

  static moveToAnotherScrap(scrap: IScrapEntry): IAction {
    return {
      key: "move-to-other-scrap",
      label: "Move to another scrap",
      icon: <Redo fontSize="small" />,
      href: `/journals/${scrap.parentId}/entries/${scrap.id}/move`,
    };
  }

  static deleteEntry(
    entry: IEntry,
    renderDialog?: (dialogProps: IDialogProps) => void,
    navigate?: NavigateFunction,
    enableHotkey?: boolean,
  ): IAction {
    const additionalProps: Partial<IAction> =
      renderDialog && navigate
        ? {
            onClick: () =>
              renderDeleteEntry(null, entry.id, entry, renderDialog, navigate),
          }
        : {
            href: `/journals/${entry.parentId}/entries/${entry.id}/delete`,
          };

    return {
      hotkey: enableHotkey ? "alt+d" : undefined,
      key: "delete",
      label: "Delete entry",
      icon: <DeleteOutlined fontSize="small" />,
      ...additionalProps,
    };
  }

  static markEntryScheduleAsDone(
    entry: IEntry,
    renderDialog?: (dialogProps: IDialogProps) => void,
    navigate?: NavigateFunction,
    enableHotkeys?: boolean,
    journalName?: string,
  ): IAction {
    return this.markEntryScheduleAsInternal(
      {
        onClick: () =>
          renderNotificationDone(
            null,
            entry,
            renderDialog,
            navigate,
            journalName,
          ),
      },
      enableHotkeys,
    );
  }

  static markEntryScheduleAsDoneViaUrl(
    entry: IEntry,
    enableHotkeys?: boolean,
  ): IAction {
    return this.markEntryScheduleAsInternal(
      {
        href: `/journals/${entry.parentId}/entries/${entry.id}/notification-done`,
      },
      enableHotkeys,
    );
  }

  static markEntryScheduleAsInternal(
    additionalProps: Partial<IAction>,
    enableHotkeys?: boolean,
  ): IAction {
    return {
      hotkey: enableHotkeys ? "alt+d" : undefined,
      key: "mark-as-done",
      label: "Mark as done",
      icon: <DoneOutlined fontSize="small" />,
      ...additionalProps,
    };
  }

  static markJournalScheduleAsDone(
    journal: IJournal,
    renderDialog?: (dialogProps: IDialogProps) => void,
    enableHotkey?: boolean,
  ): IAction {
    const additionalProps: Partial<IAction> = renderDialog
      ? {
          onClick: () => renderNotificationDone(journal, null, renderDialog),
        }
      : {
          href: `/journals/${journal.id}/notification-done`,
        };

    return {
      key: "mark-as-done",
      hotkey: enableHotkey ? "alt+d" : undefined,
      icon: <DoneOutlined fontSize="small" />,
      label: "Mark as done",
      ...additionalProps,
    };
  }

  static editEntry(entry: IEntry, enableHotkey?: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: "edit",
      label: "Edit entry",
      icon: <EditOutlined fontSize="small" />,
      href: `/journals/${entry.parentId}/entries/${entry.id}/edit`,
    };
  }

  static cancelEditing(
    onCancel: () => void,
    enableHotkey: boolean,
    isDirty: boolean,
    renderDialog: (dialogProps: IDialogProps) => void,
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+x" : undefined,
      key: "cancel-edit",
      label: "Stop editing and reset",
      icon: <ClearOutlined fontSize="small" />,
      onClick: () => {
        if (!isDirty) {
          onCancel();
          return;
        }

        renderDialog({
          title: "Are you sure?",
          render: (closeDialog) => {
            return (
              <>
                <Typography>
                  Do you really want to cancel editing without saving? All
                  changes will be lost.
                </Typography>

                <DialogFormButtonContainer>
                  <Button variant={"contained"} onClick={closeDialog}>
                    Not yet.
                  </Button>
                  <Button
                    variant={"outlined"}
                    onClick={() => {
                      onCancel();
                      closeDialog();
                    }}
                  >
                    Yeah, I&apos;m done.
                  </Button>
                </DialogFormButtonContainer>
              </>
            );
          },
        });
      },
    };
  }

  static copyValueToClipboard(
    value: string,
    setAppAlert: (appAlert: IAppAlert) => void,
  ): IAction {
    return {
      key: "copy",
      label: "Copy content",
      icon: <ContentCopyOutlined fontSize="small" />,
      onClick: async () => {
        await navigator.clipboard.writeText(value);
        setAppAlert({
          type: "success",
          title: "Successfully copied text to clipboard.",
          hideDurationSec: 1,
        });
      },
    };
  }

  static addQuickScrap(
    user: IUser,
    renderDialog?: (dialogProps: IDialogProps) => void,
  ): IAction {
    return {
      hotkey: "alt+q",
      key: "add-quick-scrap",
      icon: <PlaylistAddOutlined fontSize="small" />,
      label: "Add Quick Scrap",
      sx: { color: "common.white" },
      onClick: () =>
        renderAddScrapDialog(
          user.favoriteJournalIds[0],
          renderDialog,
          "Add Quick Scrap",
        ),
    };
  }

  static addNewNotification(
    renderDialog?: (dialogProps: IDialogProps) => void,
  ): IAction {
    return {
      hotkey: "alt+n+q",
      key: "add-notification",
      icon: <NotificationAddOutlined fontSize="small" />,
      label: "Add notification",
      sx: { color: "common.white", mr: 1 },
      onClick: () => renderAddNewNotificationDialog(renderDialog),
    };
  }

  static toggleThresholds(
    showThresholds: boolean,
    setShowThresholds: (value: boolean) => void,
  ): IAction {
    return {
      key: "thresholds",
      icon: <PanToolOutlined fontSize="small" />,
      label: "Show thresholds",
      onClick: () => setShowThresholds(!showThresholds),
      isNotActive: !showThresholds,
    };
  }

  static updateToNewVersion(): IAction {
    const color = "#fdff00";

    return {
      icon: <SwitchAccessShortcutOutlined fontSize="small" />,
      onClick: () => location.reload(),
      label: "New version available - click to update.",
      key: "update-to-new-version",
      sx: {
        color: color,
        border: "2px solid " + color,
        mr: 2,
      },
    };
  }

  static expand(onClick: () => void): IAction {
    return {
      key: "expand",
      label: "Expand",
      onClick: onClick,
      icon: <ExpandMore fontSize="small" />,
    };
  }

  static collapse(onClick: () => void): IAction {
    return {
      key: "collapse",
      label: "Collapse",
      onClick: onClick,
      icon: <ExpandLess fontSize="small" />,
    };
  }

  static refreshData(queryClient: QueryClient): IAction {
    return {
      hotkey: "alt+r",
      icon: <RefreshOutlined fontSize="small" />,
      onClick: async () => await queryClient.invalidateQueries(),
      label: "Refresh data",
      key: "refresh",
      sx: { color: "common.white" },
    };
  }

  static goToGlobalSearch(): IAction {
    return {
      key: "search",
      hotkey: "alt+g",
      icon: <SearchOutlined fontSize="small" />,
      label: "Search anything",
      href: "/search",
      sx: { color: "common.white" },
    };
  }

  static toggleDisplayMode(
    isCompact: boolean,
    setIsCompact: (value: boolean) => void,
  ): IAction {
    return {
      key: "toggle-display-mode",
      hotkey: "alt+c",
      icon: <FormatLineSpacingOutlined fontSize="small" />,
      label: "Toggle display mode",
      onClick: () => setIsCompact(!isCompact),
      sx: { color: "common.white" },
    };
  }

  static showHelp(renderDialog: (dialogProps: IDialogProps) => void): IAction {
    return {
      key: "show-help",
      hotkey: "alt+h",
      icon: <Help fontSize="small" />,
      label: "Show help",
      sx: { color: "common.white" },
      onClick: () => {
        renderDialog({
          title: "Help",
          render: () => <RegisteredActionsList />,
        });
      },
    };
  }
}
