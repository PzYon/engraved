import { Button } from "@mui/material";
import { ServerApi } from "../serverApi/ServerApi";

export const ExportYourData: React.FC = () => {
  return (
    <Button variant="outlined" onClick={exportData}>
      Export
    </Button>
  );

  async function exportData() {
    const exportedData = await ServerApi.exportData();

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(exportedData)], {
        type: "application/json",
      }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
};
