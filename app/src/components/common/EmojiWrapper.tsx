import { Emoji } from "emoji-picker-react";
import { IconStyle } from "./IconStyle";
import { styled } from "@mui/material";
import React from "react";
import { engravedEmojiStyle } from "./EngravedEmojiStyle";

export const EmojiWrapper: React.FC<{
  emoji: string;
  style: IconStyle;
}> = ({ emoji, style }) => {
  const size = style === IconStyle.Large ? 26 : 22;
  return (
    <Host size={size}>
      <Emoji unified={emoji} size={size} emojiStyle={engravedEmojiStyle} />
    </Host>
  );
};

const Host = styled("span")<{ size: number }>`
  width: ${(p) => p.size + 8}px;
  height: ${(p) => p.size + 5}px;
  display: block;

  & > span {
    cursor: pointer;
    display: block !important;
    line-height: ${(p) => p.size}px;
    font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI",
      "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji",
      "EmojiOne Color", "Android Emoji";
  }
`;
