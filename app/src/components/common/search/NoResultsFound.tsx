import { PsychologyAltOutlined } from "@mui/icons-material";
import React from "react";
import { GenericEmptyPlaceholder } from "./GenericEmptyPlaceholder";

export const NoResultsFound: React.FC = () => {
  return (
    <GenericEmptyPlaceholder
      icon={PsychologyAltOutlined}
      message="Nothing found. Try again."
    />
  );
};
