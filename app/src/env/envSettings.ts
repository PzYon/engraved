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
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
  appInsightsConnectionString: import.meta.env
    .VITE_APP_INSIGHTS_CONNECTING_STRING,
};
