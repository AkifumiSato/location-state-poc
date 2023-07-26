export type StoreState = Record<string, unknown>;

export type Store<T extends StoreState> = {
  subscribe<K extends keyof T>(name: K, listener: () => void): void;

  get<K extends keyof T>(name: K): T[K];

  set<K extends keyof T>(name: K, value: T[K]): void;

  navigationListener(key: string): void;
};
