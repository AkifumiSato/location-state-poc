export type StoreState = Record<string, unknown>;

export type Store<T extends StoreState> = {
  get<K extends keyof T>(name: K): T[K];

  set<K extends keyof T>(name: K, value: T[K]): void;
};
