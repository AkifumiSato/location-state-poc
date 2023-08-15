export type Listener = () => void;

export type Store = {
  subscribe(name: string, listener: () => void): () => void;

  get(name: string): unknown;

  set(name: string, value: unknown): void;

  load(key?: string): void;

  save(): void;
};
