import { NextPagesSyncer } from "@/lib/locationState/syncers/next-pages/next-pages-syncer";
import { Router } from "next/router";
import React from "react";

export function useNextPagesSyncer() {
  const [syncer] = React.useState(() => new NextPagesSyncer());
  const needNotify = React.useRef(false);
  if (needNotify.current) {
    syncer.notify();
    needNotify.current = false;
  }

  React.useEffect(() => {
    const routeChangeHandler = () => {
      needNotify.current = true;
    };
    Router.events.on("routeChangeStart", routeChangeHandler);
    return () => Router.events.off("routeChangeStart", routeChangeHandler);
  }, []);

  return syncer;
}
