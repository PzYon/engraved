export class EngravedServiceWorker {
  private _registration: ServiceWorkerRegistration;

  private static _instance: EngravedServiceWorker;
  static get instance(): EngravedServiceWorker {
    if (!this._instance) {
      this._instance = new EngravedServiceWorker();
    }

    return this._instance;
  }

  private constructor() {}

  showNotification(title: string, options: NotificationOptions) {
    return this._registration.showNotification(title, options);
  }

  setup() {
    this.registerServiceWorker();
  }

  ping() {
    this.sendMessage("ping");
  }

  sendMessage(message: unknown) {
    this._registration.active.postMessage(message);
  }

  private registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration: ServiceWorkerRegistration) => {
        this._registration = registration;

        this.registerNotifications();
        this.registerMessageListener();
      })
      .catch((error) => {
        console.log(
          "[main]: Error registering the Service Worker: " + error.title,
        );
      });
  }

  private registerNotifications() {
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    Notification.requestPermission().catch((e) => {
      alert("SW: Error registering notification permissions: " + e.message);
    });
  }

  private registerMessageListener() {
    navigator.serviceWorker.addEventListener("message", async (event) => {
      console.log(
        `[main]: Received message from service worker: "${event.data}"`,
      );

      this._registration.showNotification("Message from service worker", {
        body: event.data,
      });
    });
  }
}
