import React from "react";
import { envSettings } from "./env/envSettings";
import { buildInfo } from "./env/buildInfo";
import { ActionIconButton } from "./components/common/actions/ActionIconButton";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "./serverApi/reactQuery/queryKeysFactory";
import { ActionFactory } from "./components/common/actions/ActionFactory";
import { FadeInContainer } from "./components/common/FadeInContainer";
import { isNewVersionAvailable } from "./isNewVersionAvailable";

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

    queryFn: () =>
      !envSettings.isDev && isNewVersionAvailable(buildInfo.version),

    refetchOnWindowFocus: true,
  });

  return isNewDataAvailable;
};
