import React from "react";
import { Alert, AlertTitle, Snackbar, styled } from "@mui/material";
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
    <Snackbar
      open={true}
      autoHideDuration={appAlert.type === "success" ? 4000 : null}
      onClose={() => setAppAlert(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
