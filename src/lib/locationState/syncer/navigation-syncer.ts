import { Syncer } from "@/lib/locationState/syncer/types";

export class NavigationSyncer implements Syncer {
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
        if (e.navigationType === "push" || e.navigationType === "replace") {
          listener(this.navigation.currentEntry?.key as string);
        }
      },
      {
        signal,
      },
    );
  }
}
