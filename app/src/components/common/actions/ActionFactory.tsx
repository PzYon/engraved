import AddOutlined from "@mui/icons-material/AddOutlined";
import ClearOutlined from "@mui/icons-material/ClearOutlined";
import Close from "@mui/icons-material/Close";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import EditNotificationsOutlined from "@mui/icons-material/EditNotificationsOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import FormatLineSpacingOutlined from "@mui/icons-material/FormatLineSpacingOutlined";
import FunctionsOutlined from "@mui/icons-material/FunctionsOutlined";
import HistoryToggleOff from "@mui/icons-material/HistoryToggleOff";
import MessageOutlined from "@mui/icons-material/MessageOutlined";
import PanToolOutlined from "@mui/icons-material/PanToolOutlined";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";
import PlaylistAddOutlined from "@mui/icons-material/PlaylistAddOutlined";
import Redo from "@mui/icons-material/Redo";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Shortcut from "@mui/icons-material/Shortcut";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import SwitchAccessShortcutOutlined from "@mui/icons-material/SwitchAccessShortcutOutlined";
import Toc from "@mui/icons-material/Toc";
import { IJournal } from "../../../serverApi/IJournal";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IEntry } from "../../../serverApi/IEntry";
import { IAppAlert } from "../../errorHandling/AppAlertBar";
import { QueryClient } from "@tanstack/react-query";
import { IAction } from "./IAction";
import { Button, Typography } from "@mui/material";
import { DialogFormButtonContainer } from "../FormButtonContainer";
import {
  clearAllSearchParams,
  getItemActionQueryParams,
} from "./searchParamHooks";

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
      search: clearAllSearchParams(),
    };
  }

  static goToJournal(journalId: string, enableHotkeys: boolean): IAction {
    return {
      hotkey: enableHotkeys ? "alt+enter" : undefined,
      key: `go-to-journal-${journalId}`,
      href: `/journals/details/${journalId}`,
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
      key: "add-journal",
    };
  }

  static editJournal(journalId: string, enableHotkey: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: "edit",
      label: "Edit journal",
      icon: <EditOutlined fontSize="small" />,
      href: `/journals/details/${journalId}/edit`,
    };
  }

  static editJournalPermissions(journalId: string): IAction {
    return {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined fontSize="small" />,
      search: getItemActionQueryParams("permissions", journalId),
    };
  }

  static deleteJournal(journalId: string, enableHotkeys: boolean): IAction {
    return {
      hotkey: enableHotkeys ? "alt+d" : undefined,
      key: "delete",
      label: "Delete journal",
      icon: <DeleteOutlined fontSize="small" />,
      search: getItemActionQueryParams("delete", journalId),
    };
  }

  static editJournalSchedule(
    journalId: string,
    enableHotkeys?: boolean,
    hasSchedule?: boolean,
  ): IAction {
    return {
      hotkey: enableHotkeys ? "alt+t" : undefined,
      key: "edit-schedule",
      label: "Edit schedule",
      icon: hasSchedule ? (
        <DoneOutlined fontSize="small" />
      ) : (
        <EditNotificationsOutlined fontSize="small" />
      ),
      search: getItemActionQueryParams("schedule", journalId),
    };
  }

  static editEntryScheduleViaUrl(
    entryId: string,
    enableHotKeys?: boolean,
    hasSchedule?: boolean,
  ): IAction {
    return {
      key: "edit-schedule",
      hotkey: enableHotKeys ? "alt+s" : undefined,
      label: "Edit schedule",
      icon: hasSchedule ? (
        <DoneOutlined fontSize="small" />
      ) : (
        <EditNotificationsOutlined fontSize="small" />
      ),
      search: getItemActionQueryParams("schedule", entryId),
    };
  }

  static addEntry(
    journal: IJournal,
    enableHotkey: boolean,
    additionalOnClick?: () => void,
    navigateToJournal?: boolean,
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+a" : undefined,
      key: "add_entry",
      label: "Add entry",
      icon: <AddOutlined fontSize="small" />,
      href: navigateToJournal ? `/journals/details/${journal.id}` : undefined,
      search: getItemActionQueryParams("add-entry", journal.id),
      onClick: () => additionalOnClick?.(),
    };
  }

  static getToc(onClick: () => void, isNotActive: boolean): IAction {
    return {
      key: "toc",
      hotkey: "alt+i",
      label: "Table of contents",
      icon: <Toc fontSize="small" />,
      isNotActive: isNotActive,
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

  static toggleAgendaView(
    showAgenda: boolean,
    setShowAgenda: (value: boolean) => void,
  ): IAction {
    return {
      key: "agenda",
      icon: <HistoryToggleOff fontSize="small" />,
      label: "Agenda view",
      onClick: () => setShowAgenda(!showAgenda),
      isNotActive: !showAgenda,
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
      search: getItemActionQueryParams("move", scrap.id),
    };
  }

  static deleteEntry(entry: IEntry, enableHotkey?: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+d" : undefined,
      key: "delete",
      label: "Delete entry",
      icon: <DeleteOutlined fontSize="small" />,
      search: getItemActionQueryParams("delete", entry.id),
    };
  }

  static editEntry(entry: IEntry, enableHotkey?: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: "edit",
      label: "Edit entry",
      icon: <EditOutlined fontSize="small" />,
      search: getItemActionQueryParams("edit", entry.id),
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
                  <Button variant="contained" onClick={closeDialog}>
                    Not yet.
                  </Button>
                  <Button
                    variant="outlined"
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
      hotkey: "alt+c",
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

  static goTo(): IAction {
    return {
      hotkey: "alt+Period",
      key: "go-to",
      href: "/go-to",
      icon: <Shortcut fontSize="small" />,
      label: "Go to",
      sx: { color: "common.white", mr: 1 },
    };
  }

  static quickAdd(): IAction {
    return {
      hotkey: "alt+q",
      key: "quick-add",
      icon: <PlaylistAddOutlined fontSize="small" />,
      label: "Quick Add",
      sx: { color: "common.white", mr: 1 },
      href: "/quick-add",
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

  static toggleDisplayMode(
    isCompact: boolean,
    setIsCompact: (value: boolean) => void,
  ): IAction {
    return {
      key: "toggle-display-mode",
      hotkey: "alt+v",
      icon: <FormatLineSpacingOutlined fontSize="small" />,
      label: "Toggle display mode",
      onClick: () => setIsCompact(!isCompact),
      sx: { color: "common.white" },
    };
  }
}
