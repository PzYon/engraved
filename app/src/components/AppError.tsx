import { Alert, AlertTitle } from "@mui/material";
import { useAppContext } from "../AppContext";
import React from "react";

export const AppError: React.FC = () => {
  const { appError } = useAppContext();

  if (!appError) {
    return null;
  }

  return (
    <Alert severity="error">
      <AlertTitle>{appError.title}</AlertTitle>
      {appError.message}
    </Alert>
  );
};
