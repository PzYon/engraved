import React from "react";
import { IconButton, Theme } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SxProps } from "@mui/system";
import {
  AddOutlined,
  ClearOutlined,
  Close,
  ContentCopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterAltOutlined,
  Redo,
  SaveOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IScrapMeasurement } from "../../serverApi/IScrapMeasurement";
import { IAppAlert } from "../errorHandling/AppAlertBar";
import { editActionKey } from "../overview/getCommonActions";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { renderUpsertMeasurementDialog } from "../details/add/renderUpsertMeasurementDialog";
import { IMetric } from "../../serverApi/IMetric";

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

  static deleteScrap(scrap: IScrapMeasurement): IIconButtonAction {
    return {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${scrap.metricId}/measurements/${scrap.id}/delete`,
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
}

export interface IIconButtonAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  sx?: SxProps<Theme>;
  isNotActive?: boolean;
  isDisabled?: boolean;
}

export const IconButtonWrapper: React.FC<{
  action: IIconButtonAction;
}> = ({ action }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      key={action.key}
      title={action.label}
      color="default"
      aria-label={action.label}
      sx={{
        color: "primary.main",
        opacity: action.isNotActive ? 0.4 : 1,
        ...(action.sx || {}),
      }}
      onClick={(e) => executeActionClick(e, action, navigate)}
      disabled={action.isDisabled}
    >
      {action.icon}
    </IconButton>
  );
};

export function executeActionClick(
  e: React.MouseEvent<HTMLElement>,
  action: IIconButtonAction,
  navigate: NavigateFunction
) {
  e.stopPropagation();

  if (action.href) {
    navigate(action.href);
  } else if (action.onClick) {
    action.onClick();
  }
}
