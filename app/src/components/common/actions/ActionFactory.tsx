import {
  AddOutlined,
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
  Redo,
  RefreshOutlined,
  SaveOutlined,
  ShareOutlined,
  ShowChartOutlined,
  SwitchAccessShortcutOutlined,
} from "@mui/icons-material";
import { editActionKey } from "../../overview/getCommonActions";
import { IMetric } from "../../../serverApi/IMetric";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { renderUpsertMeasurementDialog } from "../../details/add/renderUpsertMeasurementDialog";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { IMeasurement } from "../../../serverApi/IMeasurement";
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
    enableHotkeys: boolean
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

  static home(): IAction {
    return {
      hotkey: "alt+h",
      key: "navigate-home",
      label: "Home",
      href: "/",
      icon: null,
    };
  }

  static createMetric(): IAction {
    return {
      hotkey: "alt+a",
      href: "/metrics/create",
      icon: <AddOutlined fontSize="small" />,
      label: "Add Metric",
      key: "add_metric",
    };
  }

  static editMetric(metricId: string, enableHotkey: boolean): IAction {
    return {
      hotkey: enableHotkey ? "alt+e" : undefined,
      key: editActionKey,
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/metrics/${metricId}/edit`,
    };
  }

  static editMetricPermissions(metricId: string): IAction {
    return {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined fontSize="small" />,
      href: `/metrics/${metricId}/permissions`,
    };
  }

  static deleteMetric(metricId: string, enableHotkeys: boolean): IAction {
    return {
      hotkey: enableHotkeys ? "alt+d" : undefined,
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${metricId}/delete`,
    };
  }

  static addMeasurement(
    metric: IMetric,
    renderDialog: (dialogProps: IDialogProps) => void,
    enableHotkey: boolean
  ): IAction {
    return {
      hotkey: enableHotkey ? "alt+a" : undefined,
      key: "add_measurement",
      label: "Add Measurement",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => renderUpsertMeasurementDialog(metric, renderDialog),
    };
  }

  static toggleNotes(
    showNotes: boolean,
    setShowNotes: (value: boolean) => void
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
    setShowChart: (value: boolean) => void
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
    enableHotkey: boolean
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
    setShowGroupTotals: (value: boolean) => void
  ): IAction {
    return {
      key: "groupTotals",
      icon: <FunctionsOutlined fontSize="small" />,
      label: "Show group total",
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

  static moveToAnotherScrap(scrap: IScrapMeasurement): IAction {
    return {
      key: "move-to-other-scrap",
      label: "Move to another scrap",
      icon: <Redo fontSize="small" />,
      href: `/metrics/${scrap.metricId}/measurements/${scrap.id}/move`,
    };
  }

  static deleteMeasurement(measurement: IMeasurement): IAction {
    return {
      hotkey: "alt+d",
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${measurement.metricId}/measurements/${measurement.id}/delete`,
    };
  }

  static editMeasurement(measurement: IMeasurement): IAction {
    return {
      hotkey: "alt+e",
      key: "edit",
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/metrics/${measurement.metricId}/measurements/${measurement.id}/edit`,
    };
  }

  static cancelEditing(onCancel: () => void): IAction {
    return {
      key: "cancel-edit",
      label: "Stop editing and reset",
      icon: <ClearOutlined fontSize="small" />,
      onClick: onCancel,
    };
  }

  static copyValueToClipboard(
    value: string,
    setAppAlert: (appAlert: IAppAlert) => void
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
    renderDialog?: (dialogProps: IDialogProps) => void
  ): IAction {
    return {
      key: "add-quick-scrap",
      icon: <BoltOutlined fontSize="small" />,
      label: "Add Quick Scrap",
      sx: { color: "common.white", mr: 1 },
      onClick: () =>
        renderAddScrapDialog(
          user.favoriteMetricIds[0],
          renderDialog,
          "Add Quick Scrap"
        ),
    };
  }

  static toggleThresholds(
    showThresholds: boolean,
    setShowThresholds: (value: boolean) => void
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
    return {
      icon: <SwitchAccessShortcutOutlined fontSize="small" />,
      onClick: () => location.reload(),
      label: "New version available - click to update.",
      key: "update-to-new-version",
      sx: { color: "#fdff00" },
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
}
