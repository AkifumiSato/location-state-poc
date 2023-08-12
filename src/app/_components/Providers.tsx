"use client";

import { NavigationSyncerProvider } from "@/lib/locationState/Provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavigationSyncerProvider stores={["session-store"]}>
      {children}
    </NavigationSyncerProvider>
  );
}
