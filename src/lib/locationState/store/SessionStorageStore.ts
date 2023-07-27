import type { Store } from "./type";

export class SessionStorageStore implements Store {
  private state: Record<string, unknown> = {};
  private listeners: Record<string, Array<() => void>> = {};

  constructor() {}

  subscribe(name: string, listener: () => void) {
    this.listeners[name] ??= [];
    this.listeners[name].push(listener);
    return () => {
      this.listeners = {};
    };
  }

  get(name: string) {
    return this.state[name] ?? null;
  }

  set(name: string, value: unknown) {
    this.state[name] = value;
    this.listeners[name]?.forEach((listener) => listener());
  }

  onLocationChange(key: string) {
    const value = sessionStorage.getItem(`__location_state_${key}`);
    if (value !== null) {
      this.state = JSON.parse(value);
    }
  }
}
