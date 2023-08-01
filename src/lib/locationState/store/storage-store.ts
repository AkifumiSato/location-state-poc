import { Listener } from "./type";
import type { Store } from "./type";

export const locationKeyPrefix = "__location_state_";

export class StorageStore implements Store {
  private currentKey: string | null = null;
  private state: Record<string, unknown> = {};
  private listeners: Map<string, Set<Listener>> = new Map();

  constructor(private readonly storage: Storage) {}

  subscribe(name: string, listener: () => void) {
    const listeners = this.listeners.get(name);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.listeners.set(name, new Set([listener]));
    }
    return () => this.unsubscribe(name, listener);
  }

  unsubscribe(name: string, listener: Listener) {
    const listeners = this.listeners.get(name);
    listeners?.delete(listener);
    if (listeners?.size === 0) {
      this.listeners.delete(name);
    }
  }

  get(name: string) {
    return this.state[name];
  }

  set(name: string, value: unknown) {
    this.state[name] = value;
    this.listeners.get(name)?.forEach((listener) => listener());
  }

  load(locationKey: string) {
    this.currentKey = locationKey;
    const value = this.storage.getItem(this.createStorageKey(locationKey));
    if (value !== null) {
      this.state = JSON.parse(value);
    } else {
      this.state = {};
    }
  }

  save() {
    if (!this.currentKey) {
      throw new Error(
        "StoreStorage's currentKey is null. Please call load() first.",
      );
    }
    this.storage.setItem(
      this.createStorageKey(this.currentKey),
      JSON.stringify(this.state),
    );
  }

  private createStorageKey(key: string) {
    return `${locationKeyPrefix}${key}`;
  }
}
