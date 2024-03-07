self.addEventListener("install", () => {
  log("Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  log("Service worker activated");
});

self.addEventListener("notificationclick", (e) => {
  log("Clicked " + e.action);
});

self.addEventListener("message", (event) => {
  log("Message received:", event.data);

  if (event.data === "ping") {
    self.registration.showNotification("Pong!", {
      body: "Returned from sw.js...",
    });
  }
});

function log(message, ...params) {
  console.log("[sw]: " + message, ...params);
}
