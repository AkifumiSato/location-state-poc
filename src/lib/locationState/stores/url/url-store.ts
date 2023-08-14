import type { Listener, Store } from "../types";

export class UrlStore implements Store {
  private readonly key: string;

  constructor({ key }: { key: string }) {
    this.key = key;
  }

  subscribe(name: string, listener: Listener) {
    return () => {
      throw new Error("Method not implemented.");
    };
  }

  get(name: string) {
    const search = location.search;
    const params = new URLSearchParams(search);
    const param = params.get(this.key);
    if (param === null) return undefined;
    const data = JSON.parse(param);
    return data[name];
  }

  set(name: string, value: unknown) {
    const search = location.search;
    const params = new URLSearchParams(search);
    const param = params.get(this.key);
    const data = param ? JSON.parse(param) : {};
    data[name] = value;
    params.set(this.key, JSON.stringify(data));
    const newSearch = params.toString();
    const newUrl = `${location.pathname}?${newSearch}`;
    history.replaceState(history.state, "", newUrl);
  }

  load(key: string) {
    throw new Error("Method not implemented.");
  }

  save() {
    throw new Error("Method not implemented.");
  }
}
