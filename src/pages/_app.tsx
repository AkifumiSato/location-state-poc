import { useNextPagesSyncer } from "@/lib/locationState/pages-router/hooks";
import { LocationStateProvider } from "@/lib/locationState/Provider";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  const syncer = useNextPagesSyncer();
  return (
    <LocationStateProvider syncer={syncer}>
      <Component {...pageProps} />
    </LocationStateProvider>
  );
}
