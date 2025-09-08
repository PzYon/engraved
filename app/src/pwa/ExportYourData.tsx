import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";
import React, { useState } from "react";

export const ExportYourData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button variant="outlined" onClick={exportData} disabled={isLoading}>
      Export
    </Button>
  );

  async function exportData() {
    setIsLoading(true);

    const exportedData = await ServerApi.exportData();

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(exportedData, null, 2)], {
        type: "application/json",
      }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `engraved-user-data-${new Date().toISOString()}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setIsLoading(false);
  }
};
