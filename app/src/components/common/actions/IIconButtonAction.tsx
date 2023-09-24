import React from "react";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";

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
