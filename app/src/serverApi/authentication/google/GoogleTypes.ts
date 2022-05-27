export type GoogleInitializeResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};

export type GoogleInitializeInput = {
  client_id: string;
  callback: (response: GoogleInitializeResponse) => void;
};

export type Google = {
  accounts: {
    id: {
      initialize: (input: GoogleInitializeInput) => void;
      renderButton: (
        domElement: HTMLElement,
        params: { theme: string; size: string }
      ) => void;
    };
  };
};
