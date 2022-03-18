import React from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useAppContext } from "../../AppContext";

export interface IAppAlert {
  message: string;
  title: string;
  type: "success" | "info" | "warning" | "error";
}

export const AppAlertBar: React.FC = () => {
  const { appAlert } = useAppContext();

  if (!appAlert) {
    return null;
  }

  return (
    <Alert severity={appAlert.type}>
      <AlertTitle>{appAlert.title}</AlertTitle>
      {appAlert.message}
    </Alert>
  );
};
