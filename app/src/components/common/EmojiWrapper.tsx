import { Emoji } from "emoji-picker-react";
import { IconStyle } from "./IconStyle";
import { styled } from "@mui/material";
import React from "react";
import { engravedEmojiStyle } from "./EngravedEmojiStyle";
import { MuiTheme } from "../../theming/engravedTheme";

export const EmojiWrapper: React.FC<{
  emoji: string;
  style: IconStyle;
  isClickable?: boolean;
}> = ({ emoji, style, isClickable }) => {
  const size = style === IconStyle.Large ? 26 : 22;
  return (
    <Host
      isClickable={isClickable}
      size={size}
      className={`ngrvd-icon${isClickable ? " clickable" : ""}`}
    >
      <Emoji unified={emoji} size={size} emojiStyle={engravedEmojiStyle} />
    </Host>
  );
};

const Host = styled("span")<{
  size: number;
  isClickable?: boolean;
}>`
  width: ${(p: MuiTheme) => p.size + 8}px;
  height: ${(p: MuiTheme) => p.size + 5}px;
  display: block;
  margin-left: -2px;
  cursor: ${(p: MuiTheme) => (p.isClickable ? "pointer" : "default")};

  & > span,
  & > img {
    display: block !important;
    line-height: ${(p: MuiTheme) => p.size}px;
    font-family:
      "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji",
      "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";
  }
`;
