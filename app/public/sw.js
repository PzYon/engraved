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

let periodicSyncCounter = 1;

self.addEventListener("periodicsync", (e) => {
  log("Periodic sync: " + e.tag);
  self.registration.showNotification(
    `The PWA is still alive (periodicSync): ${periodicSyncCounter++}`,
  );
});

// async function sendGetScheduledToMain(clients) {
// const allClients = await clients.matchAll();
// const client = await clients.get(allClients[0].id);
// client.postMessage("get-scheduled");

//  return Promise.resolve();
// }

let setTimeoutCounter = 1;

self.engravedIntervalTimer = setInterval(
  () => {
    self.registration.showNotification(
      `The PWA is still alive (setInterval): ${setTimeoutCounter++}`,
    );
  },
  2 * 60 * 1000,
);

function log(message, ...params) {
  console.log("[sw]: " + message, ...params);
}
