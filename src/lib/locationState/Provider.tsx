import { LocationStoresContext } from "@/lib/locationState/hooks";
import { StorageStore } from "@/lib/locationState/store/storage-store";
import { NavigationSyncer } from "@/lib/locationState/syncer/navigation/navigation-syncer";
import { Syncer } from "@/lib/locationState/syncer/navigation/types";
import { ReactNode, useEffect, useRef } from "react";

export function LocationStateProvider({
  syncer,
  children,
}: {
  syncer?: Syncer;
  children: ReactNode;
}) {
  const storesRef = useRef({
    session: new StorageStore(globalThis.sessionStorage),
  });
  const stores = storesRef.current;

  useEffect(() => {
    const navigationSyncer = syncer ?? new NavigationSyncer(navigation);
    const abortController = new AbortController();

    const key = navigationSyncer.key()!;
    Object.values(stores).forEach((store) => {
      store.load(key);
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
  }, [syncer, stores]);

  return (
    <LocationStoresContext.Provider value={{ stores }}>
      {children}
    </LocationStoresContext.Provider>
  );
}
