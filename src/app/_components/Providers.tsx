"use client";

import { LocationStateProvider } from "@/lib/locationState/Provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LocationStateProvider>{children}</LocationStateProvider>;
}
