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

import { IIconButtonAction } from "./IIconButtonAction";

export class ActionFactory {
  static cancel(onClick: () => void): IIconButtonAction {
    return {
      key: "cancel",
      label: "Cancel",
      icon: <Close fontSize="small" />,
      onClick: onClick,
    };
  }

  static save(
    onClick: () => Promise<void>,
    isDisabled?: boolean
  ): IIconButtonAction {
    return {
      key: "save",
      label: "Save",
      icon: <SaveOutlined fontSize="small" />,
      onClick: onClick,
      isDisabled: isDisabled,
    };
  }

  static home(): IIconButtonAction {
    return {
      key: "navigate-home",
      label: "Home",
      href: "/",
      icon: null,
    };
  }

  static createMetric(): IIconButtonAction {
    return {
      href: "/metrics/create",
      icon: <AddOutlined fontSize="small" />,
      label: "Add Metric",
      key: "add_metric",
    };
  }

  static editMetric(metricId: string): IIconButtonAction {
    return {
      key: editActionKey,
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/metrics/${metricId}/edit`,
    };
  }

  static editMetricPermissions(metricId: string): IIconButtonAction {
    return {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined fontSize="small" />,
      href: `/metrics/${metricId}/permissions`,
    };
  }

  static deleteMetric(metricId: string): IIconButtonAction {
    return {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${metricId}/delete`,
    };
  }

  static addMeasurement(
    metric: IMetric,
    renderDialog?: (dialogProps: IDialogProps) => void
  ): IIconButtonAction {
    return {
      key: "add_measurement",
      label: "Add Measurement",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => renderUpsertMeasurementDialog(metric, renderDialog),
    };
  }

  static toggleNotes(
    showNotes: boolean,
    setShowNotes: (value: boolean) => void
  ): IIconButtonAction {
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
  ): IIconButtonAction {
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
    setShowFilters: (v: boolean) => void
  ): IIconButtonAction {
    return {
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
  ): IIconButtonAction {
    return {
      key: "groupTotals",
      icon: <FunctionsOutlined fontSize="small" />,
      label: "Show group total",
      onClick: () => setShowGroupTotals(!showGroupTotals),
      isNotActive: !showGroupTotals,
    };
  }

  static edit(onEdit: () => void): IIconButtonAction {
    return {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      onClick: onEdit,
    };
  }

  static moveToAnotherScrap(scrap: IScrapMeasurement): IIconButtonAction {
    return {
      key: "move-to-other-scrap",
      label: "Move to another scrap",
      icon: <Redo fontSize="small" />,
      href: `/metrics/${scrap.metricId}/measurements/${scrap.id}/move`,
    };
  }

  static deleteMeasurement(measurement: IMeasurement): IIconButtonAction {
    return {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${measurement.metricId}/measurements/${measurement.id}/delete`,
    };
  }

  static editMeasurement(measurement: IMeasurement): IIconButtonAction {
    return {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/metrics/${measurement.metricId}/measurements/${measurement.id}/edit`,
    };
  }

  static cancelEditing(onCancel: () => void): IIconButtonAction {
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
  ): IIconButtonAction {
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
  ): IIconButtonAction {
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
  ): IIconButtonAction {
    return {
      key: "thresholds",
      icon: <PanToolOutlined fontSize="small" />,
      label: "Show thresholds",
      onClick: () => setShowThresholds(!showThresholds),
      isNotActive: !showThresholds,
    };
  }

  static updateToNewVersion(): IIconButtonAction {
    return {
      icon: <SwitchAccessShortcutOutlined fontSize="small" />,
      onClick: () => location.reload(),
      label: "New version available - click to update.",
      key: "update-to-new-version",
      sx: { color: "#fdff00" },
    };
  }

  static expand(onClick: () => void): IIconButtonAction {
    return {
      key: "expand",
      label: "Expand",
      onClick: onClick,
      icon: <ExpandMore fontSize="small" />,
    };
  }

  static collapse(onClick: () => void): IIconButtonAction {
    return {
      key: "collapse",
      label: "Collapse",
      onClick: onClick,
      icon: <ExpandLess fontSize="small" />,
    };
  }

  static appInfo(showInfo: () => void): IIconButtonAction {
    return {
      icon: <HelpOutlineOutlined fontSize="small" />,
      onClick: () => showInfo(),
      label: "Show App Info",
      key: "app_info",
      sx: { color: "common.white" },
    };
  }

  static refreshData(queryClient: QueryClient): IIconButtonAction {
    return {
      icon: <RefreshOutlined fontSize="small" />,
      onClick: async () => await queryClient.invalidateQueries(),
      label: "Refresh data",
      key: "refresh",
      sx: { color: "common.white" },
    };
  }
}
