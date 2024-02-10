import React from "react";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";

export const ScrapListBody: React.FC<{
  hideActions?: boolean;
  hasTitleFocus: boolean;
  hasFocus?: boolean;
}> = ({ hideActions, hasTitleFocus, hasFocus }) => (
  <ScrapBody
    hideActions={hideActions}
    actions={[]}
    enableHotkeys={hasFocus || hasTitleFocus}
  >
    <ScrapList hasTitleFocus={hasTitleFocus} />
  </ScrapBody>
);
