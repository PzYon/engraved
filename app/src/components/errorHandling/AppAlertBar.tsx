import React from "react";
import { Alert, AlertTitle, styled } from "@mui/material";
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

const Host = styled("div")`
  position: fixed;
  bottom: ${(p) => p.theme.spacing(2)};
  right: ${(p) => p.theme.spacing(2)};
  z-index: 4321;
`;
