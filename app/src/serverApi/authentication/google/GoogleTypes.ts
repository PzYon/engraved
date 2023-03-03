export type GoogleInitializeResponse = {
  credential: string;
  select_by: string;
};

export type GoogleInitializeInput = {
  client_id: string;
  callback: (response: GoogleInitializeResponse) => void;
};

export type GoogleNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

export type Google = {
  accounts: {
    id: {
      initialize: (input: GoogleInitializeInput) => void;
      renderButton: (
        domElement: HTMLElement,
        params: { theme: string; size: string; shape: string; type: string }
      ) => void;
      prompt: (notification: GoogleNotification) => void;
    };
  };
};
