import React from "react";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";

export const ScrapListBody: React.FC = () => {
  return (
    <ScrapBody actions={[]}>
      <ScrapList />
    </ScrapBody>
  );
};
