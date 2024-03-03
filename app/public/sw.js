self.addEventListener("install", () => {
  console.log("Service worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service worker activated");
});

self.addEventListener("periodicsync", (event) => {
  console.log("SW: periodic sync: " + event.tag);

  if (event.tag === "get-scheduled") {
    // todo: get scheduled from API and check if we should notify?!
    event.waitUntil(
      self.registration.showNotification("Got scheduled via background sync", {
        body: "Wicked!",
      }),
    );
  }
});
