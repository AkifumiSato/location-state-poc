import { Store } from "../store";

export class UrlStore extends Store {
  private readonly key: string;

  constructor({ key }: { key: string }) {
    super();
    this.key = key;
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
