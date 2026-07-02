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

  // Bypass the HTTP cache so we always read the freshly deployed chunk;
  // otherwise a cached response could hide that a new version is available.
  const response = await fetch("/chunks/envSettings.js", {
    cache: "no-store",
  });
  const text = await response.text();
  const match = /version\s*:\s*(["'`])(\d+)\1/m.exec(text);
  const version = match?.[2];

  return version !== envSettings.version;
}
