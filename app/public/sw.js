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
    e.waitUntil(sendGetScheduledToMain(self.clients));
  }
});

self.addEventListener("message", (event) => {
  log("Message received", event.data);
});

async function sendGetScheduledToMain(clients) {
  const allClients = await clients.matchAll();
  const client = await clients.get(allClients[0].id);
  client.postMessage("get-scheduled");

  return Promise.resolve();
}

function log(message, ...params) {
  console.log("[sw]: " + message, ...params);
}

const tenMinutes = 10 * 60 * 1000;

setInterval(() => {
  self.registration.showNotification("Your PWA is still alive.");
}, tenMinutes);
