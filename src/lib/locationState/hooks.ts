import { StorageStore } from "@/lib/locationState/store/storage-store";
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export const StorageStoreContext = createContext<StorageStore | null>(null);

export const useLocationState = <T>({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: T;
}) => {
  // todo: only session storage impl now
  const storageStore = useContext(StorageStoreContext);
  if (!storageStore) {
    // todo: fix message
    throw new Error("Provider is required");
  }
  const subscribe = useCallback(
    (onStoreChange: () => void) => storageStore.subscribe(name, onStoreChange),
    [name, storageStore],
  );
  const getSnapshot = useCallback(
    () => storageStore.get(name) as T,
    [storageStore, name],
  );
  const storeState = useSyncExternalStore(subscribe, getSnapshot);
  const setStoreState = useCallback(
    (value: T) => {
      storageStore.set(name, value);
    },
    [name, storageStore],
  );
  return [storeState ?? defaultValue, setStoreState];
};
