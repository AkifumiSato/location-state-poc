import { Syncer } from "@/lib/locationState/syncer/types";

export class NavigationSyncer implements Syncer {
  private prevKey?: string;

  constructor(private readonly navigation?: Navigation) {}

  key(): string | undefined {
    return this.navigation?.currentEntry?.key;
  }

  sync({
    listener,
    signal,
  }: {
    listener: (key: string) => void;
    signal: AbortSignal;
  }): void {
    this.navigation?.addEventListener(
      "currententrychange",
      (e) => {
        const { navigationType } = e as NavigateEvent;
        if (navigationType !== "push" && navigationType !== "replace") {
          return;
        }
        // Since an Entry always exists at the time of `currententrychange, it is non-null.
        const currentKey = this.key()!;
        if (this.prevKey === currentKey) {
          // `history.replace` may cause events to fire with the same key.
          // https://github.com/WICG/navigation-api#the-current-entry
          return;
        }

        listener(currentKey);
        this.prevKey = currentKey;
      },
      {
        signal,
      },
    );
  }
}
