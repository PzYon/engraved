import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import { useAppContext } from "../../AppContext";

export interface IAppAlert {
  message?: string;
  title: string;
  type: "success" | "info" | "warning" | "error";
}

export const AppAlertBar: React.FC = () => {
  const { appAlert, setAppAlert } = useAppContext();

  if (!appAlert) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "1234",
      }}
    >
      <Alert
        severity={appAlert.type}
        variant="filled"
        onClose={() => setAppAlert(null)}
      >
        <AlertTitle>{appAlert.title}</AlertTitle>
        {appAlert.message}
      </Alert>
    </Box>
  );
};
