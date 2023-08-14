import { LocationStateContext } from "@/lib/locationState/context";
import { StorageStore } from "@/lib/locationState/store/storage-store";
import { NavigationSyncer } from "@/lib/locationState/syncer/navigation/navigation-syncer";
import { Syncer } from "@/lib/locationState/syncer/navigation/types";
import { ReactNode, useEffect, useRef } from "react";

export function LocationStateProvider({
  children,
  ...props
}: {
  syncer?: Syncer;
  children: ReactNode;
}) {
  const storesRef = useRef({
    session: new StorageStore(globalThis.sessionStorage),
  });
  const stores = storesRef.current;

  useEffect(() => {
    const syncer = props.syncer ?? new NavigationSyncer(navigation);
    const abortController = new AbortController();
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
      signal: abortController.signal,
    });
    window?.addEventListener("beforeunload", () => {
      applyAllStore((store) => store.save());
    });
    return () => abortController.abort();
  }, [props.syncer, stores]);

  return (
    <LocationStateContext.Provider value={{ stores }}>
      {children}
    </LocationStateContext.Provider>
  );
}
