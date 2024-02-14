import { createContext, useContext } from "react";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import { IUser } from "./serverApi/IUser";

export interface IAppContext {
  appAlert: IAppAlert;
  setAppAlert: (appAlert: IAppAlert) => void;
  user: IUser;
  setUser: (user: IUser) => void;
}

export const AppContext = createContext<IAppContext>({
  appAlert: null,
  setAppAlert: null,
  user: null,
  setUser: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};
