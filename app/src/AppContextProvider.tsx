import { IUser } from "./serverApi/IUser";
import React, { useMemo, useState } from "react";
import { AppContext, IAppContext } from "./AppContext";
import { ServerApi } from "./serverApi/ServerApi";
import { IAppAlert } from "./components/errorHandling/IAppAlert";

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  user: IUser;
}> = ({ children, user: initialUser }) => {
  const [appAlert, setAppAlert] = useState<IAppAlert | null>(null);
  const [user, setUser] = useState(initialUser);

  const contextValue = useMemo<IAppContext>(() => {
    return {
      appAlert,
      setAppAlert,
      user,
      setUser,
      reloadUser: async () => {
        const reloadedUser = await ServerApi.getCurrentUser();
        setUser(reloadedUser);
      },
    };
  }, [appAlert, user]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
