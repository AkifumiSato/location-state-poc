import { Listener } from "./type";
import type { Store } from "./type";

export const locationKeyPrefix = "__location_state_";

export class StorageStore implements Store {
  private currentKey: string | null = null;
  private state: Record<string, unknown> = {};
  private listeners: Map<string, Set<Listener>> = new Map();

  constructor(private readonly storage: Storage) {}

  subscribe(name: string, listener: () => void) {
    const listeners = this.listeners.get(name) ?? new Set();
    listeners.add(listener);
    this.listeners.set(name, listeners);
    return () => {
      this.listeners.get(name)?.delete(listener);
    };
  }

  get(name: string) {
    return this.state[name];
  }

  set(name: string, value: unknown) {
    this.state[name] = value;
    this.listeners.get(name)?.forEach((listener) => listener());
  }

  onLocationChange(locationKey: string) {
    if (this.currentKey) {
      this.storage.setItem(
        this.createStorageKey(this.currentKey),
        JSON.stringify(this.state),
      );
    }
    this.currentKey = locationKey;
    const value = this.storage.getItem(this.createStorageKey(locationKey));
    if (value !== null) {
      this.state = JSON.parse(value);
    } else {
      this.state = {};
    }
  }

  private createStorageKey(key: string) {
    return `${locationKeyPrefix}${key}`;
  }
}