"use client";

import { LocationStateProvider } from "@/lib/locationState/Provider";
import { NavigationSyncer } from "@/lib/locationState/syncers/navigation/navigation-syncer";
import { unsafeNavigation } from "@/lib/locationState/syncers/navigation/unsafe-navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationStateProvider syncer={new NavigationSyncer(unsafeNavigation)}>
      {children}
    </LocationStateProvider>
  );
}
