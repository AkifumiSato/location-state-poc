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
      const currentKey = this.key()!;

      // todo: ブラウザバック・フォワードではうまくいくが遷移時に古いkeyのままなので初期化が必要
      // https://github.com/recruit-tech/recoil-sync-next/blob/main/src/history/useSyncHistory.ts#L90C1-L92C41
      listener(currentKey);
    };
    this.router.events.on("routeChangeStart", handler);

    signal.addEventListener("abort", () => {
      this.router.events.off("routeChangeStart", handler);
    });
  }
}
