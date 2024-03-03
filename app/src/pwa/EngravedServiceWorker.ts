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

  private registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration: ServiceWorkerRegistration) => {
        this._registration = registration;

        this.registerNotifications();
      })
      .catch((error) => {
        console.log("SW: Error registering the Service Worker: " + error.title);
      });
  }

  private registerNotifications() {
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    Notification.requestPermission().catch((e) => {
      alert("SW: Error registering notification permissions: " + e.message);
    });

    addEventListener("notificationclick", () => {
      alert("Notification action clicked.");
    });
  }
}
