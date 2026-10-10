import { tooltipEnterDelayMs } from "../../../theming/engravedTheme";

// The delays of a MUI tooltip, which the shared one stands in for: a long
// press shows it, it stays for a moment after the finger is lifted, and while
// moving from one element to the next it does not make one wait again.
const enterTouchDelayMs = 700;
const leaveTouchDelayMs = 1500;
const quickSuccessionMs = 800;

interface ITooltipRequest {
  // Identifies the element across renders, in which it may get another title.
  ownerId: string;
  element: HTMLElement;
  title: string;
}

interface ISharedTooltipState extends ITooltipRequest {
  isOpen: boolean;
}

// Decides at which element the one tooltip of the app is, and when. A tooltip
// of its own for every element is what made a list expensive to render: there
// are hundreds of icon buttons on a page, and hardly any is ever hovered.
export class SharedTooltipStore {
  // Who asked for the tooltip last. It is theirs from then on, also while they
  // are still waiting for it and after it has been closed.
  private request: ITooltipRequest | undefined;

  private state: ISharedTooltipState | undefined;

  private timer: number | undefined;

  private closedAt = Number.NEGATIVE_INFINITY;

  private readonly listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = () => this.state;

  show(ownerId: string, element: HTMLElement, title: string, isTouch: boolean) {
    this.request = { ownerId, element, title };
    this.runAfter(this.getEnterDelayMs(isTouch), this.open);
  }

  hide(ownerId: string, isTouch: boolean) {
    if (this.request?.ownerId !== ownerId) {
      return;
    }

    this.runAfter(isTouch ? leaveTouchDelayMs : 0, this.close);
  }

  // For an element that is gone. Its tooltip goes at once, as fading out it
  // would have no place to be anymore.
  remove(ownerId: string) {
    if (this.request?.ownerId === ownerId) {
      window.clearTimeout(this.timer);
      this.request = undefined;
    }

    if (this.state?.ownerId === ownerId) {
      this.setState(undefined);
    }
  }

  setTitle(ownerId: string, title: string) {
    if (this.request?.ownerId === ownerId) {
      this.request = { ...this.request, title };
    }

    if (this.state?.ownerId === ownerId && this.state.title !== title) {
      this.setState({ ...this.state, title });
    }
  }

  close = () => {
    window.clearTimeout(this.timer);

    if (!this.state?.isOpen) {
      return;
    }

    this.closedAt = Date.now();
    this.setState({ ...this.state, isOpen: false });
  };

  private open = () => {
    if (this.request) {
      this.setState({ ...this.request, isOpen: true });
    }
  };

  private getEnterDelayMs(isTouch: boolean) {
    if (isTouch) {
      return enterTouchDelayMs;
    }

    const isInQuickSuccession =
      this.state?.isOpen || Date.now() - this.closedAt < quickSuccessionMs;

    return isInQuickSuccession ? 0 : tooltipEnterDelayMs;
  }

  private runAfter(delayMs: number, action: () => void) {
    window.clearTimeout(this.timer);

    if (delayMs === 0) {
      action();
      return;
    }

    this.timer = window.setTimeout(action, delayMs);
  }

  private setState(state: ISharedTooltipState | undefined) {
    this.state = state;
    this.listeners.forEach((listener) => listener());
  }
}
