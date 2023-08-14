import { LocationStateContext } from "@/lib/locationState/context";
import { StorageStore } from "@/lib/locationState/stores/storage/storage-store";
import { NavigationSyncer } from "@/lib/locationState/syncers/navigation/navigation-syncer";
import { Syncer } from "@/lib/locationState/syncers/navigation/types";
import { ReactNode, useEffect, useState } from "react";

export function LocationStateProvider({
  children,
  ...props
}: {
  syncer?: Syncer;
  children: ReactNode;
}) {
  const [contextValue] = useState(() => ({
    stores: {
      session: new StorageStore(globalThis.sessionStorage),
    },
  }));

  useEffect(() => {
    const stores = contextValue.stores;
    const syncer = props.syncer ?? new NavigationSyncer(navigation);
    const abortController = new AbortController();
    const { signal } = abortController;
    const applyAllStore = (callback: (store: StorageStore) => void) => {
      Object.values(stores).forEach(callback);
    };

    const key = syncer.key()!;
    applyAllStore((store) => store.load(key));

    syncer.sync({
      listener: (key) => {
        applyAllStore((store) => {
          store.save();
          store.load(key);
        });
      },
      signal,
    });
    window?.addEventListener(
      "beforeunload",
      () => {
        applyAllStore((store) => store.save());
      },
      { signal },
    );

    return () => abortController.abort();
  }, [props.syncer, contextValue.stores]);

  return (
    <LocationStateContext.Provider value={contextValue}>
      {children}
    </LocationStateContext.Provider>
  );
}
