import { LocationStoresContext } from "@/lib/locationState/hooks";
import { StorageStore } from "@/lib/locationState/store/storage-store";
import { ReactNode } from "react";

const stores = {
  "session-storage": new StorageStore(sessionStorage),
};

export function LocationStateProvider({ children }: { children: ReactNode }) {
  return (
    <LocationStoresContext.Provider value={{ stores }}>
      {children}
    </LocationStoresContext.Provider>
  );
}
