import React from "react";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";
import { RegisterableHotkey } from "@tanstack/react-hotkeys";

export interface IAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  search?: Record<string, string>;
  sx?: SxProps<Theme>;
  isNotActive?: boolean;
  isDisabled?: boolean;
  hotkey?: RegisterableHotkey;
  hotkeyScopeRef?:
    | React.RefObject<HTMLElement>
    | HTMLElement
    | Document
    | Window
    | null;
}
