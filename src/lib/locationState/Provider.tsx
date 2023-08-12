import { LocationStoresContext } from "@/lib/locationState/hooks";
import { StorageStore } from "@/lib/locationState/store/storage-store";
import { NavigationSyncer } from "@/lib/locationState/syncer/navigation/navigation-syncer";
import { StoreName } from "@/lib/locationState/types";
import { ReactNode, useEffect } from "react";

const allStores = {
  "session-store": new StorageStore(globalThis.sessionStorage ?? undefined),
};

export function NavigationSyncerProvider({
  stores: targetStores,
  children,
}: {
  stores: StoreName[];
  children: ReactNode;
}) {
  const stores = Object.fromEntries(
    targetStores.map((store) => [store, allStores[store]]),
  );

  useEffect(() => {
    const navigationSyncer = new NavigationSyncer(navigation);
    const abortController = new AbortController();

    Object.values(stores).forEach((store) => {
      store.load(navigationSyncer.key()!);
    });

    navigationSyncer.sync({
      listener: (key) => {
        Object.values(stores).forEach((store) => {
          store.save();
          store.load(key);
        });
      },
      signal: abortController.signal,
    });
    return () => abortController.abort();
  }, [stores]);

  return (
    <LocationStoresContext.Provider value={{ stores }}>
      {children}
    </LocationStoresContext.Provider>
  );
}
