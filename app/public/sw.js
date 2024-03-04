self.addEventListener("install", () => {
  log("Service worker installed");
});

self.addEventListener("activate", () => {
  log("Service worker activated");
});

self.addEventListener("notificationclick", (e) => {
  log("Clicked " + e.action);
});

self.addEventListener("periodicsync", (event) => {
  log("Periodic sync: " + event.tag);

  if (event.tag === "get-scheduled") {
    // todo: get scheduled from API and check if we should notify?!
    event.waitUntil(
      self.registration.showNotification("Got scheduled via background sync", {
        body: "Wicked!",
      }),
    );
  }
});

self.addEventListener("message", (event) => {
  log(`Message received: ${event.data}`);
});

function log(message) {
  console.log("[sw]: " + message);
}
