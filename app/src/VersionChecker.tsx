import React from "react";
import { envSettings } from "./env/envSettings";
import { useAppContext } from "./AppContext";

export const VersionChecker: React.FC = () => {
  const { setNewVersion, newVersion } = useAppContext();

  return (
    <span
      onClick={async () => {
        if (newVersion) {
          location.reload();
        }

        const response = await fetch("/envSettings.js");
        const text = await response.text();

        const version = new RegExp(/version: "(\d+)"/gm).exec(text)[1];

        if (version !== envSettings.version) {
          setNewVersion();
        }
      }}
    >
      {newVersion ? "Load new version" : "Check for new verison"}
    </span>
  );
};
