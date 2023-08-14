import { Store } from "../store";

export class UrlStore extends Store {
  private readonly key: string;
  private state: Record<string, unknown> = {};

  constructor({ key }: { key: string }) {
    super();
    this.key = key;
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
    this.notify(name);
  }

  load() {
    const search = location.search;
    const params = new URLSearchParams(search);
    const param = params.get(this.key);
    this.state = param ? JSON.parse(param) : {};
    queueMicrotask(() => this.notifyAll());
  }

  save() {
    const params = new URLSearchParams();
    params.set(this.key, JSON.stringify(this.state));
    const newSearch = params.toString();
    const newUrl = `${location.pathname}?${newSearch}`;
    history.replaceState(history.state, "", newUrl);
  }
}
