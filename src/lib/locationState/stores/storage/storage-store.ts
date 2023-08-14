import { Listener } from "../types";
import type { Store } from "../types";

export const locationKeyPrefix = "__location_state_";

export class StorageStore implements Store {
  private currentKey: string | null = null;
  private state: Record<string, unknown> = {};
  private listeners: Map<string, Set<Listener>> = new Map();

  constructor(private readonly storage?: Storage) {}

  subscribe(name: string, listener: () => void) {
    const listeners = this.listeners.get(name);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.listeners.set(name, new Set([listener]));
    }
    return () => this.unsubscribe(name, listener);
  }

  private unsubscribe(name: string, listener: Listener) {
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
    if (typeof value === "undefined") {
      delete this.state[name];
    } else {
      this.state[name] = value;
    }
    this.listeners.get(name)?.forEach((listener) => listener());
  }

  load(locationKey: string) {
    if (this.currentKey === locationKey) return;
    this.currentKey = locationKey;
    const value = this.storage?.getItem(this.createStorageKey()) ?? null;
    if (value !== null) {
      // todo: impl JSON or Transit
      this.state = JSON.parse(value);
    } else {
      this.state = {};
    }
    queueMicrotask(() => {
      this.listeners.forEach((listeners) =>
        listeners.forEach((listener) => listener()),
      );
    });
  }

  save() {
    if (!this.currentKey) {
      return;
    }
    if (Object.keys(this.state).length === 0) {
      this.storage?.removeItem(this.createStorageKey());
      return;
    }
    this.storage?.setItem(this.createStorageKey(), JSON.stringify(this.state));
  }

  private createStorageKey() {
    return `${locationKeyPrefix}${this.currentKey}`;
  }
}
