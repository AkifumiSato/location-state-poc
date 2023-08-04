import { Store } from "@/lib/locationState/store/types";
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export const LocationStoresContext = createContext<{
  stores: Record<string, Store>;
}>({ stores: {} });

export const useLocationState = <T>({
  name,
  defaultValue,
  storeName,
}: {
  name: string;
  defaultValue: T;
  storeName: string;
}) => {
  const { stores } = useContext(LocationStoresContext);
  const store = stores[storeName];
  if (!store) {
    // todo: fix message
    throw new Error("Provider is required");
  }
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(name, onStoreChange),
    [name, store],
  );
  const getSnapshot = () => store.get(name) ?? defaultValue;
  const getServerSnapshot = () => defaultValue;
  const storeState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const setStoreState = useCallback(
    (value: T) => {
      store.set(name, value);
    },
    [name, store],
  );
  return [storeState ?? defaultValue, setStoreState];
};
