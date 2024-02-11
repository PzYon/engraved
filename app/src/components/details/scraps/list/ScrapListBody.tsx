import React from "react";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";

export const ScrapListBody: React.FC<{
  hasTitleFocus: boolean;
  hasFocus?: boolean;
}> = ({ hasTitleFocus, hasFocus }) => (
  <ScrapBody actions={[]} enableHotkeys={hasFocus || hasTitleFocus}>
    <ScrapList hasTitleFocus={hasTitleFocus} />
  </ScrapBody>
);
