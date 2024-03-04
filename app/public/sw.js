self.addEventListener("install", () => {
  log("Service worker installed");
});

self.addEventListener("activate", () => {
  log("Service worker activated");
});

self.addEventListener("notificationclick", (e) => {
  log("Clicked " + e.action);
});

self.addEventListener("periodicsync", (e) => {
  log("Periodic sync: " + e.tag);

  if (e.tag === "get-scheduled") {
    // todo: get scheduled from API and check if we should notify?!
    e.waitUntil(sendGetScheduledToMain(self.registration));

    // self.registration.showNotification("Got scheduled via background sync", {
    //  body: "Wicked!",
    // })
  }
});

self.addEventListener("message", (event) => {
  log(`Message received: ${event.data}`);
});

function log(message) {
  console.log("[sw]: " + message);
}

function sendGetScheduledToMain(r) {
  r.active.postMessage("get-scheduled");
  return Promise.resolve();
}
