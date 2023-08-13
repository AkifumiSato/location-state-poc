import { LocationStateContext } from "@/lib/locationState/context";
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

    const applyAllStore = (callback: (store: StorageStore) => void) => {
      Object.values(stores).forEach((store) => {
        callback(store);
      });
    };
    navigationSyncer.sync({
      listener: (key) => {
        applyAllStore((store) => {
          store.save();
          store.load(key);
        });
      },
      signal: abortController.signal,
    });
    window?.addEventListener("beforeunload", () => {
      applyAllStore((store) => store.save());
    });
    return () => abortController.abort();
  }, [syncer, stores]);

  return (
    <LocationStateContext.Provider value={{ stores }}>
      {children}
    </LocationStateContext.Provider>
  );
}
