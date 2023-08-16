import { Store } from "@/lib/locationState/stores/types";
import { createContext } from "react";

export const LocationStateContext = createContext<{
  stores: Record<string, Store>;
}>({ stores: {} });
