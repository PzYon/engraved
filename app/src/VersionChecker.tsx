import React from "react";
import { envSettings } from "./env/envSettings";
import { IconButtonWrapper } from "./components/common/actions/IconButtonWrapper";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "./serverApi/reactQuery/queryKeysFactory";
import { ActionFactory } from "./components/common/actions/ActionFactory";

async function isNewVersionAvailable() {
  if (envSettings.isDev) {
    return false;
  }

  const response = await fetch("/envSettings.js");
  const text = await response.text();
  const version = new RegExp(/version:"(\d+)"/gm).exec(text)[1];

  return version !== envSettings.version;
}

export const VersionChecker: React.FC = () => {
  const isNewVersionAvailable = useIsNewVersionAvailableQuery();

  if (!isNewVersionAvailable) {
    return null;
  }

  return <IconButtonWrapper action={ActionFactory.updateToNewVersion()} />;
};

const useIsNewVersionAvailableQuery = () => {
  const { data: isNewDataAvailable } = useQuery<boolean>({
    queryKey: queryKeysFactory.appVersion(),

    queryFn: () => isNewVersionAvailable(),

    refetchOnWindowFocus: true,
  });

  return isNewDataAvailable;
};
