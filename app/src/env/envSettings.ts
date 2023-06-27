export const envSettings = {
  auth: {
    google: {
      clientId:
        "791638561996-u8a0gf3af7b33qtk178djpek4054ir4d.apps.googleusercontent.com",
    },
  },
  apiBaseUrlWindows: import.meta.env.VITE_API_BASE_URL,
  apiBaseUrlLinux: import.meta.env.VITE_API_BASE_URL_LINUX,
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  version: import.meta.env.VITE_VERSION,
  mergeDateTime: import.meta.env.VITE_MERGE_DATE_TIME,
};
