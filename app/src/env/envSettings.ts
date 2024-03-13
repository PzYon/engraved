export const envSettings = {
  auth: {
    google: {
      clientId:
        "791638561996-u8a0gf3af7b33qtk178djpek4054ir4d.apps.googleusercontent.com",
    },
  },
  notifications: {
    appId: import.meta.env.VITE_NOTIFICATIONS_APP_ID,
  },
  apiBaseUrlWindows: import.meta.env.VITE_API_BASE_URL,
  apiBaseUrlLinux: import.meta.env.VITE_API_BASE_URL_LINUX,
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  version: import.meta.env.VITE_VERSION,
  mergeDateTime: import.meta.env.VITE_MERGE_DATE_TIME,
  isDev: import.meta.env.DEV,
  appInsightsConnectionString: import.meta.env
    .VITE_APP_INSIGHTS_CONNECTING_STRING,
};
