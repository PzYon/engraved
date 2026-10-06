export async function isNewVersionAvailable(
  runningVersion: string | undefined,
): Promise<boolean> {
  const deployedVersion = await getDeployedVersion();

  return deployedVersion !== undefined && deployedVersion !== runningVersion;
}

// version.json is written by the build (see vite.config.js) and names the
// version that is deployed right now. Neither the HTTP cache nor the service
// worker may answer this request, or a deploy would go unnoticed.
async function getDeployedVersion(): Promise<string | undefined> {
  try {
    const response = await fetch("/version.json", { cache: "no-store" });
    const { version } = (await response.json()) as { version?: string };

    return version;
  } catch {
    // Offline, or the host answered with something else than the file: we do
    // not know what is deployed, and offering an update that a reload cannot
    // deliver helps nobody.
    return undefined;
  }
}
