import type { Store } from "./type";

export class SessionStorageStore implements Store {
  private readonly listeners: Record<string, Array<() => void>>;

  constructor(private state: Record<string, unknown>) {
    this.listeners = Object.keys(state).reduce(
      (acc, key) => {
        acc[key] = [];
        return acc;
      },
      {} as typeof this.listeners,
    );
  }

  subscribe(name: string, listener: () => void) {
    this.listeners[name].push(listener);
  }

  get(name: string) {
    return this.state[name];
  }

  set(name: string, value: unknown) {
    this.listeners[name]?.forEach((listener) => listener());
    this.state[name] = value;
  }

  navigationListener(key: string) {
    const value = sessionStorage.getItem(`__location_state_${key}`);
    if (value !== null) {
      this.state = JSON.parse(value);
    }
  }
}
