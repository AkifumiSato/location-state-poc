type Listener = () => void;

export interface Store {
  onSet?(name: string, value: unknown): void;
}

export abstract class Store {
  protected listeners: Map<string, Set<Listener>> = new Map();
  protected state: Record<string, unknown> = {};

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

  protected async notifyAll() {
    return new Promise((resolve) => {
      queueMicrotask(() => {
        this.listeners.forEach((listeners) =>
          listeners.forEach((listener) => listener()),
        );
        resolve(undefined);
      });
    });
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
    this.onSet?.(name, value);
    this.notify(name);
  }

  abstract load(key?: string): Promise<void>;

  abstract save(): void;
}
