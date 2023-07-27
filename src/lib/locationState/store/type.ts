export type StoreState = Record<string, unknown>;

export type Store = {
  subscribe(name: string, listener: () => void): void;

  get(name: string): unknown;

  set(name: string, value: unknown): void;

  onLocationChange(key: string): void;
};
