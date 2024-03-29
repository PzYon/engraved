import React from "react";
import { envSettings } from "./env/envSettings";
import { ActionIconButton } from "./components/common/actions/ActionIconButton";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "./serverApi/reactQuery/queryKeysFactory";
import { ActionFactory } from "./components/common/actions/ActionFactory";
import { FadeInContainer } from "./components/common/FadeInContainer";

export const VersionChecker: React.FC = () => {
  const isNewVersionAvailable = useIsNewVersionAvailableQuery();

  if (!isNewVersionAvailable) {
    return null;
  }

  return (
    <FadeInContainer doPulsate={true}>
      <ActionIconButton action={ActionFactory.updateToNewVersion()} />
    </FadeInContainer>
  );
};

const useIsNewVersionAvailableQuery = () => {
  const { data: isNewDataAvailable } = useQuery<boolean>({
    queryKey: queryKeysFactory.appVersion(),

    queryFn: () => isNewVersionAvailable(),

    refetchOnWindowFocus: true,
  });

  return isNewDataAvailable;
};

async function isNewVersionAvailable() {
  if (envSettings.isDev) {
    return false;
  }

  const response = await fetch("/envSettings.js");
  const text = await response.text();
  const version = new RegExp(/version:"(\d+)"/gm).exec(text)[1];

  return version !== envSettings.version;
}
