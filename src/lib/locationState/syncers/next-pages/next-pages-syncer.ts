import { Syncer } from "@/lib/locationState/syncers/types";
import { NextRouter } from "next/router";

export class NextPagesSyncer implements Syncer {
  private readonly listeners = new Set<(key: string) => void>();

  constructor(private readonly router: NextRouter) {}

  key(): string | undefined {
    return globalThis.history.state.key;
  }

  sync({
    listener,
    signal,
  }: {
    listener: (key: string) => void;
    signal: AbortSignal;
  }): void {
    this.listeners.add(listener);
    signal?.addEventListener("abort", () => {
      this.listeners.delete(listener);
    });
  }

  notify() {
    const currentKey = this.key()!;
    this.listeners.forEach((listener) => listener(currentKey));
  }

  updateURL(url: string): void {
    this.router.replace(url, undefined, { shallow: true });
  }
}
