import type { Store, StoreState } from "./type";

export class SessionStorageStore<T extends StoreState> implements Store<T> {
  private listeners: Record<keyof T, Array<() => void>>;

  constructor(private state: T) {
    this.listeners = Object.keys(state).reduce(
      (acc, key) => {
        acc[key as keyof T] = [];
        return acc;
      },
      {} as typeof this.listeners,
    );
  }

  subscribe<K extends keyof T>(name: K, listener: () => void) {
    this.listeners[name].push(listener);
  }

  get<K extends keyof T>(name: K): T[K] {
    return this.state[name];
  }

  set<K extends keyof T>(name: K, value: T[K]) {
    this.listeners[name]?.forEach((listener) => listener());
    this.state[name] = value;
  }

  navigationListener(key: string) {
    const value = sessionStorage.getItem(`__location_state_${key}`);
    if (value !== null) {
      this.state = JSON.parse(value) as T;
    }
  }
}
