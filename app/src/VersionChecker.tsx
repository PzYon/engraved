import React from "react";
import { envSettings } from "./env/envSettings";
import { SwitchAccessShortcutOutlined } from "@mui/icons-material";
import { IconButtonWrapper } from "./components/common/IconButtonWrapper";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "./serverApi/reactQuery/queryKeysFactory";

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

  return (
    <IconButtonWrapper
      action={{
        icon: <SwitchAccessShortcutOutlined fontSize="small" />,
        onClick: () => location.reload(),
        label: "New version available - click to update.",
        key: "update-to-new-version",
        sx: { color: "#fdff00" },
      }}
    />
  );
};

const thirtyMinutes = 60 * 1000 * 30;

const useIsNewVersionAvailableQuery = () => {
  const { data: isNewDataAvailable } = useQuery<boolean>({
    queryKey: queryKeysFactory.appVersion(),

    queryFn: () => isNewVersionAvailable(),

    refetchInterval: thirtyMinutes,

    refetchOnWindowFocus: true,
  });

  return isNewDataAvailable;
};
