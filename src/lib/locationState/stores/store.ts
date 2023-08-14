export type Listener = () => void;

export abstract class Store {
  protected listeners: Map<string, Set<Listener>> = new Map();

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

  protected notify(name: string) {
    this.listeners.get(name)?.forEach((listener) => listener());
  }

  protected notifyAll() {
    this.listeners.forEach((listeners) =>
      listeners.forEach((listener) => listener()),
    );
  }

  abstract get(name: string): unknown;

  abstract set(name: string, value: unknown): void;

  abstract load(key?: string): void;

  abstract save(): void;
}
