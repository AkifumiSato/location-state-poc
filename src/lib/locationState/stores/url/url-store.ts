import type { Listener, Store } from "../types";

export class UrlStore implements Store {
  private readonly key: string;
  private state: Record<string, unknown> = {};

  constructor({ key }: { key: string }) {
    this.key = key;
  }

  subscribe(name: string, listener: Listener) {
    return () => {
      throw new Error("Method not implemented.");
    };
  }

  get(name: string) {
    return this.state[name];
  }

  set(name: string, value: unknown) {
    this.state[name] = value;
  }

  load() {
    const search = location.search;
    const params = new URLSearchParams(search);
    const param = params.get(this.key);
    this.state = param ? JSON.parse(param) : {};
  }

  save() {
    const params = new URLSearchParams();
    params.set(this.key, JSON.stringify(this.state));
    const newSearch = params.toString();
    const newUrl = `${location.pathname}?${newSearch}`;
    history.replaceState(history.state, "", newUrl);
  }
}
