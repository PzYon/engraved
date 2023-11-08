import React from "react";
import { Alert, AlertTitle, Snackbar, styled } from "@mui/material";
import { useAppContext } from "../../AppContext";

export interface IAppAlert {
  message?: React.ReactNode;
  title: string;
  type: "success" | "info" | "warning" | "error";
  hideDurationSec?: number;
  relatedEntityId?: string;
}

export const AppAlertBar: React.FC = () => {
  const { appAlert, setAppAlert } = useAppContext();

  if (!appAlert) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      data-testid={"app-alert-bar"}
      data-related-entity-id={appAlert.relatedEntityId}
      autoHideDuration={
        appAlert.type === "success"
          ? (appAlert.hideDurationSec ?? 4) * 1000
          : null
      }
      onClose={() => setAppAlert(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <StyledAlert
        severity={appAlert.type}
        variant="filled"
        onClose={() => setAppAlert(null)}
      >
        <AlertTitle>{appAlert.title}</AlertTitle>
        {appAlert.message}
      </StyledAlert>
    </Snackbar>
  );
};

const StyledAlert = styled(Alert)`
  align-items: center;

  .MuiAlert-message {
    padding: 0;
  }

  .MuiTypography-root {
    margin: 0;
  }

  .MuiAlert-icon {
    padding: 0;
  }

  .MuiAlert-action {
    padding-top: 0;
  }
`;
