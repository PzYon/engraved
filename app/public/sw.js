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

  //  if (e.tag === "get-scheduled") {
  //    e.waitUntil(sendGetScheduledToMain(self.clients));
  //  }
});

self.addEventListener("message", (event) => {
  log("Message received", event.data);

  if (event.data === "ping") {
    self.registration.showNotification("Pong!", {
      body: "Returned from sw.js...",
    });
  }
});

// async function sendGetScheduledToMain(clients) {
// const allClients = await clients.matchAll();
// const client = await clients.get(allClients[0].id);
// client.postMessage("get-scheduled");

//  return Promise.resolve();
// }

function log(message, ...params) {
  console.log("[sw]: " + message, ...params);
}

const tenMinutes = 10 * 60 * 1000;

let i = 1;

function scheduleNotificationIn10min() {
  setTimeout(() => {
    self.registration.showNotification("Your PWA is still alive: " + ++i);
  }, tenMinutes);
}

scheduleNotificationIn10min();
