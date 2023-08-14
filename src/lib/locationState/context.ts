import { Store } from "@/lib/locationState/stores/store";
import { createContext } from "react";

export const LocationStateContext = createContext<{
  stores: Record<string, Store>;
}>({ stores: {} });
