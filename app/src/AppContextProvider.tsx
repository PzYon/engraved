import { IUser } from "./serverApi/IUser";
import { IAppAlert } from "./components/errorHandling/AppAlertBar";
import React, { useMemo, useState } from "react";
import { AppContext } from "./AppContext";

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user: initialUser }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert>(undefined);
  const [user, setUser] = useState(initialUser);

  const contextValue = useMemo(() => {
    return {
      appAlert,
      setAppAlert,
      user,
      setUser,
    };
  }, [appAlert, user]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
