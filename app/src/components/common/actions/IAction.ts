import React from "react";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";

export interface IAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  sx?: SxProps<Theme>;
  isNotActive?: boolean;
  isDisabled?: boolean;
  hotkey?: string;
}
