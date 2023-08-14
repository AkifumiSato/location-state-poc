import { Store } from "@/lib/locationState/store/types";
import { createContext } from "react";

export const LocationStateContext = createContext<{
  stores: Record<string, Store>;
}>({ stores: {} });
