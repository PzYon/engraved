// Describes the build the running code came from. Deliberately not part of
// envSettings: that chunk has a fixed file name and is fetched network-first
// (see vite.config.js), so after a deploy it describes the newest build on the
// server rather than the code that is actually running.
export const buildInfo = {
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  version: import.meta.env.VITE_VERSION,
  mergeDateTime: import.meta.env.VITE_MERGE_DATE_TIME,
};
