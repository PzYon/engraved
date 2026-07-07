import CloudOffOutlined from "@mui/icons-material/CloudOffOutlined";
import React from "react";
import { GenericEmptyPlaceholder } from "./GenericEmptyPlaceholder";

// Shown when a view's data has not been cached yet and cannot be loaded
// because the app is offline (see useIsOffline).
export const OfflinePlaceholder: React.FC = () => {
  return (
    <GenericEmptyPlaceholder
      icon={CloudOffOutlined}
      message="Data not available as offline."
    />
  );
};
