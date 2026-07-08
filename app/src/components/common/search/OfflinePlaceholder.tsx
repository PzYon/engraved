import CloudOffOutlined from "@mui/icons-material/CloudOffOutlined";
import React from "react";
import { GenericEmptyPlaceholder } from "./GenericEmptyPlaceholder";

export const OfflinePlaceholder: React.FC = () => {
  return (
    <GenericEmptyPlaceholder
      icon={CloudOffOutlined}
      message="Data is not available as you are offline."
    />
  );
};
