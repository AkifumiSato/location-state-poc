export type Listener = () => void;

export type Store = {
  subscribe(name: string, listener: Listener): () => void;

  get(name: string): unknown;

  set(name: string, value: unknown): void;

  onLocationChange(key: string): void;
};
