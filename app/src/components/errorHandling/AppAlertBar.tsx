import React from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";

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
    <Host>
      <Alert
        severity={appAlert.type}
        variant="filled"
        onClose={() => setAppAlert(null)}
      >
        <AlertTitle>{appAlert.title}</AlertTitle>
        {appAlert.message}
      </Alert>
    </Host>
  );
};

const Host = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1234;
`;
