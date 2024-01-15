import {
  AddOutlined,
  AlarmOutlined,
  BoltOutlined,
  ClearOutlined,
  Close,
  ContentCopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandLess,
  ExpandMore,
  FilterAltOutlined,
  FunctionsOutlined,
  HelpOutlineOutlined,
  MessageOutlined,
  PanToolOutlined,
  PlaylistAdd,
  Redo,
  RefreshOutlined,
  SaveOutlined,
  SearchOutlined,
  ShareOutlined,
  ShowChartOutlined,
  SwitchAccessShortcutOutlined,
} from "@mui/icons-material";
import { editActionKey } from "../../overview/getCommonActions";
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
      key: editActionKey,
      label: "Edit",
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
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/journals/${journalId}/delete`,
    };
  }

  static editJournalSchedule(journalId: string): IAction {
    return {
      key: "edit-schedule",
      label: "Edit schedule",
      icon: <AlarmOutlined fontSize="small" />,
      href: `/journals/${journalId}/schedule`,
    };
  }

  static editEntitySchedule(journalId: string, entryId: string): IAction {
    return {
      key: "edit-schedule",
      label: "Edit schedule",
      icon: <AlarmOutlined fontSize="small" />,
      href: `/journals/${journalId}/entries/${entryId}/schedule`,
    };
  }

  static addEntry(
    journal: IJournal,
    renderDialog: (dialogProps: IDialogProps) => void,
    enableHotkey: boolean,
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+a" : undefined,
      key: "add_entry",
      label: "Add Entry",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => renderUpsertEntryDialog(journal, renderDialog),
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
      label: "Edit",
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

  static deleteEntry(entry: IEntry): IAction {
    return {
      hotkey: "alt+d",
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/journals/${entry.parentId}/entries/${entry.id}/delete`,
    };
  }

  static editEntry(entry: IEntry): IAction {
    return {
      hotkey: "alt+e",
      key: "edit",
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/journals/${entry.parentId}/entries/${entry.id}/edit`,
    };
  }

  static cancelEditing(onCancel: () => void, enableHotkey: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+x" : undefined,
      key: "cancel-edit",
      label: "Stop editing and reset",
      icon: <ClearOutlined fontSize="small" />,
      onClick: () => onCancel(),
    };
  }

  static copyValueToClipboard(
    value: string,
    setAppAlert: (appAlert: IAppAlert) => void,
  ): IAction {
    return {
      key: "copy",
      label: "Copy",
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
      icon: <BoltOutlined fontSize="small" />,
      label: "Add Quick Scrap",
      sx: { color: "common.white", mr: 1 },
      onClick: () =>
        renderAddScrapDialog(
          user.favoriteJournalIds[0],
          renderDialog,
          "Add Quick Scrap",
        ),
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

  static appInfo(showInfo: () => void): IAction {
    return {
      icon: <HelpOutlineOutlined fontSize="small" />,
      onClick: () => showInfo(),
      label: "Show App Info",
      key: "app_info",
      sx: { color: "common.white" },
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
      label: "Search",
      href: "/search",
      sx: { color: "common.white" },
    };
  }
}
