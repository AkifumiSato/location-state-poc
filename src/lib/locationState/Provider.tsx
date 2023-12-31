import { LocationStateContext } from "@/lib/locationState/context";
import { StorageStore } from "@/lib/locationState/stores/storage/storage-store";
import { Store } from "@/lib/locationState/stores/types";
import { URLStore } from "@/lib/locationState/stores/url/url-store";
import { NavigationSyncer } from "@/lib/locationState/syncers/navigation/navigation-syncer";
import { Syncer } from "@/lib/locationState/syncers/types";
import { ReactNode, useEffect, useState } from "react";

export function LocationStateProvider({
  children,
  ...props
}: {
  syncer?: Syncer;
  children: ReactNode;
}) {
  const [syncer] = useState(
    () => props.syncer ?? new NavigationSyncer(window.navigation),
  );
  const [contextValue] = useState(() => ({
    stores: {
      session: new StorageStore(globalThis.sessionStorage),
      url: new URLStore("location-state", syncer),
    },
  }));

  useEffect(() => {
    const stores = contextValue.stores;
    const abortController = new AbortController();
    const { signal } = abortController;
    const applyAllStore = (callback: (store: Store) => void) => {
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
  }, [syncer, contextValue.stores]);

  return (
    <LocationStateContext.Provider value={contextValue}>
      {children}
    </LocationStateContext.Provider>
  );
}
