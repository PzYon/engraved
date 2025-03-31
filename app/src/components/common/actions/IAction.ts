import React from "react";
import { SxProps, Theme } from "@mui/material";

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
  hotkey?: string;
}
