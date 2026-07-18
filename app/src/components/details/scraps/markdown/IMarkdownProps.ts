import { MouseEventHandler } from "react";

export interface IMarkdownProps {
  value: string;
  onClick?: MouseEventHandler;
  useBasic?: boolean;
}
