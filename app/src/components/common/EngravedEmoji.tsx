import { IconStyle } from "./IconStyle";
import { styled } from "@mui/material";
import React from "react";

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
      {emojiChar}
    </Host>
  );
};

function unifiedToEmoji(unified: string) {
  if (!unified || typeof unified !== "string") {
    return "";
  }

  try {
    return unified
      .split("-")
      .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
      .join("");
  } catch {
    return "";
  }
}

const Host = styled("span")<{
  size: number;
  isClickable?: boolean;
}>`
  margin-top: -5px;
  display: block;
  font-size: ${(p) => p.size}px;
  cursor: ${(p) => (p.isClickable ? "pointer" : "default")};
  font-family:
    "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji",
    "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";
`;
