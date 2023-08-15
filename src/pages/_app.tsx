import { LocationStateProvider } from "@/lib/locationState/Provider";
import { NextPagesSyncer } from "@/lib/locationState/syncers/next-pages/next-pages-syncer";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [nextSyncer] = useState(() => new NextPagesSyncer(router));
  return (
    <LocationStateProvider syncer={nextSyncer}>
      <Component {...pageProps} />
    </LocationStateProvider>
  );
}
