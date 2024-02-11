import React from "react";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";
import { useScrapContext } from "../ScrapContext";

export const ScrapListBody: React.FC<{
  hasTitleFocus: boolean;
}> = ({ hasTitleFocus }) => {
  const { hasFocus } = useScrapContext();

  return (
    <ScrapBody actions={[]} enableHotkeys={hasFocus || hasTitleFocus}>
      <ScrapList hasTitleFocus={hasTitleFocus} />
    </ScrapBody>
  );
};
