import { createContext, useContext } from "react";
import { IUser } from "./serverApi/IUser";
import { IAppAlert } from "./components/errorHandling/IAppAlert";

export interface IAppContext {
  setAppAlert: (appAlert: IAppAlert | null) => void;
  user: IUser;
  setUser: (user: IUser) => void;
  reloadUser: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  setAppAlert: null!,
  user: null!,
  setUser: null!,
  reloadUser: null!,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

// The alert being shown lives in a context of its own, as it changes far more
// often than the rest: almost everything uses AppContext, for the user or to
// set an alert, and all of that would re-render with every alert otherwise.
export const AppAlertContext = createContext<IAppAlert | null>(null);

export const useAppAlert = () => {
  return useContext(AppAlertContext);
};
