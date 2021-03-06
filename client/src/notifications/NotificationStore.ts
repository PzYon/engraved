import { BehaviorSubject } from "rxjs";
import { INotification } from "./INotification";

export class NotificationStore {
  private static cachedInstance: NotificationStore;

  public notifications$: BehaviorSubject<INotification[]> = new BehaviorSubject<
    INotification[]
  >([]);

  public static get instance(): NotificationStore {
    if (!this.cachedInstance) {
      this.cachedInstance = new NotificationStore();
    }
    return this.cachedInstance;
  }

  public addNotification(n: INotification) {
    if (!this.notifications$.value.find((x: INotification) => x.id === n.id)) {
      if (n.timeToLiveInSeconds > 0) {
        setTimeout(
          () => this.removeNotification(n),
          n.timeToLiveInSeconds * 1000
        );
      }

      this.notifications$.next([...this.notifications$.value, n]);
    }
  }

  public removeNotification(n: INotification) {
    const notifications: INotification[] = [...this.notifications$.value];
    const index = notifications.indexOf(n);
    if (index > -1) {
      notifications.splice(index, 1);
      this.notifications$.next(notifications);
    }
  }
}
