import { PsychologyAltOutlined } from "@mui/icons-material";
import React from "react";
import { GenericEmptyPlaceholder } from "./GenericEmptyPlaceholder";

export const NoResultsFound: React.FC<{ hideTryAgain?: boolean }> = ({
  hideTryAgain,
}) => {
  return (
    <GenericEmptyPlaceholder
      icon={PsychologyAltOutlined}
      message={"Nothing found. " + (hideTryAgain ? "" : "Try again.")}
    />
  );
};
