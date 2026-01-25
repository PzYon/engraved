import { IconStyle } from "./IconStyle";
import { styled } from "@mui/material";
import React from "react";

// Convert unified emoji code to actual emoji character
const unifiedToEmoji = (unified: string): string => {
  return unified
    .split("-")
    .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
    .join("");
};

export const EngravedEmoji: React.FC<{
  emoji: string;
  style: IconStyle;
  isClickable?: boolean;
}> = ({ emoji, style, isClickable }) => {
  const size = style === IconStyle.Large ? 26 : 22;
  const emojiChar = unifiedToEmoji(emoji);
  
  return (
    <Host
      isClickable={isClickable}
      size={size}
      className={`ngrvd-icon${isClickable ? " clickable" : ""}`}
    >
      <Emoji size={size}>{emojiChar}</Emoji>
    </Host>
  );
};

const Host = styled("span")<{
  size: number;
  isClickable?: boolean;
}>`
  width: ${(p) => p.size + 8}px;
  height: ${(p) => p.size + 5}px;
  display: block;
  margin-left: -2px;
  cursor: ${(p) => (p.isClickable ? "pointer" : "default")};
`;

const Emoji = styled("span")<{ size: number }>`
  display: inline-block;
  margin-top: -5px;
  font-size: ${(p) => p.size}px;
  font-family:
    "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji",
    "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";
`;
