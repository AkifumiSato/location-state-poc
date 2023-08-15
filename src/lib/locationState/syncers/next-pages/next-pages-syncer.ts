import { Syncer } from "@/lib/locationState/syncers/navigation/types";
import { NextRouter } from "next/router";

export class NextPagesSyncer implements Syncer {
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
    const handler = () => {
      // Since an Entry always exists at the time of `routeChangeStart`, it is non-null.
      listener(this.key()!);
    };
    this.router.events.on("routeChangeComplete", handler);

    signal.addEventListener("abort", () => {
      this.router.events.off("routeChangeComplete", handler);
    });
  }
}
