import React, { createContext, useContext, useState } from "react";

export interface IAppContext {
  pageTitle: string;
  setPageTitle: (pageTitle: string) => void;
}

export const AppContext = createContext<IAppContext>({
  pageTitle: null,
  setPageTitle: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: React.FC = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");

  return (
    <AppContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </AppContext.Provider>
  );
};
