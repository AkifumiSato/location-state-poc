import { v4 as uuidv4 } from "uuid";

class PartialNavigationHistoryEntry implements Partial<NavigationHistoryEntry> {
  readonly key?: string;

  constructor(public url?: string) {
    if (url) {
      this.key = uuidv4();
    }
  }
}

class PartialNavigateEvent implements Partial<NavigateEvent> {
  constructor(public navigationType: NavigationApiNavigationType) {}
}

class PartialNavigation implements Partial<Navigation> {
  currentEntry?: NavigationHistoryEntry;
  private listenersMap = new Map<string, EventListener[]>();

  constructor(public currentUrl?: string) {
    this.setEntryWithUrl(currentUrl);
  }

  private setEntryWithUrl(url?: string) {
    this.currentEntry = new PartialNavigationHistoryEntry(
      url,
    ) as NavigationHistoryEntry;
  }

  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult {
    const { history = "push" } = options || {};
    this.setEntryWithUrl(url);
    this.dispatchEntryChangeEvent(history as "push" | "replace");
    return {
      // not implemented
    } as NavigationResult;
  }

  private dispatchEntryChangeEvent(type: NavigationApiNavigationType) {
    const event = new PartialNavigateEvent(type) as NavigateEvent;
    const listeners = this.listenersMap.get("currententrychange");
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  addEventListener(
    type: string,
    listener: EventListener,
    _options?: AddEventListenerOptions,
  ) {
    if (type !== "currententrychange") throw new Error("Not implemented");
    if (this.listenersMap.has(type)) {
      this.listenersMap.get(type)?.push(listener);
    } else {
      this.listenersMap.set(type, [listener]);
    }
  }

  reload() {
    return {
      // not implemented
    } as NavigationResult;
  }
}

export const createNavigationMock = (url?: string) =>
  new PartialNavigation(url) as unknown as Navigation;
