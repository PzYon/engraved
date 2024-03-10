const env = import.meta.env;

export const envSettings = {
  auth: {
    google: {
      clientId:
        "791638561996-u8a0gf3af7b33qtk178djpek4054ir4d.apps.googleusercontent.com",
    },
  },
  notifications: {
    appId: env.VITE_NOTIFICATIONS_APP_ID,
  },
  apiBaseUrlWindows: env.VITE_API_BASE_URL,
  apiBaseUrlLinux: env.VITE_API_BASE_URL_LINUX,
  commitHash: env.VITE_COMMIT_HASH,
  version: env.VITE_VERSION,
  mergeDateTime: env.VITE_MERGE_DATE_TIME,
  isDev: env.DEV,
  appInsightsConnectionString: env.VITE_APP_INSIGHTS_CONNECTING_STRING,
};
