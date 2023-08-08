import { Syncer } from "@/lib/locationState/syncer/types";

export class NavigationSyncer implements Syncer {
  private lastPublishedEntryKey?: string;

  constructor(private readonly navigation: Navigation) {}

  key(): string | undefined {
    return this.navigation.currentEntry?.key;
  }

  sync({
    listener,
    signal,
  }: {
    listener: (key: string) => void;
    signal: AbortSignal;
  }): void {
    this.navigation.addEventListener(
      "currententrychange",
      (e) => {
        if (this.lastPublishedEntryKey === this.navigation.currentEntry?.key) {
          // `history.replace` may cause events to fire with the same key.
          // https://github.com/WICG/navigation-api#the-current-entry
          return;
        }

        if (e.navigationType === "push" || e.navigationType === "replace") {
          listener(this.navigation.currentEntry?.key as string);
          this.lastPublishedEntryKey = this.navigation.currentEntry?.key;
        }
      },
      {
        signal,
      },
    );
  }
}
