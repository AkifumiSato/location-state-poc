import { Store } from "../store";

export const locationKeyPrefix = "__location_state_";

export class StorageStore extends Store {
  private currentKey: string | null = null;

  constructor(private readonly storage?: Storage) {
    super();
  }

  load(locationKey: string) {
    if (this.currentKey === locationKey) return;
    this.currentKey = locationKey;
    const value = this.storage?.getItem(this.createStorageKey()) ?? null;
    if (value !== null) {
      // todo: impl JSON or Transit
      this.state = JSON.parse(value);
    } else {
      this.state = {};
    }
    this.notifyAll();
  }

  save() {
    if (!this.currentKey) {
      return;
    }
    if (Object.keys(this.state).length === 0) {
      this.storage?.removeItem(this.createStorageKey());
      return;
    }
    this.storage?.setItem(this.createStorageKey(), JSON.stringify(this.state));
  }

  private createStorageKey() {
    return `${locationKeyPrefix}${this.currentKey}`;
  }
}
