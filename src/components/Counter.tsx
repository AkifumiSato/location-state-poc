"use client";

import { useLocationState } from "@/lib/locationState/hooks";
import { StoreName } from "@/lib/locationState/types";

export function Counter({ storeName }: { storeName: StoreName }) {
  const [counter, setCounter] = useLocationState({
    name: "counter",
    defaultValue: 0,
    storeName,
  });
  console.debug("rendered Counter", { storeName, counter });

  return (
    <div>
      <p>
        storeName: <b>{storeName}</b>, counter: <b>{counter}</b>
      </p>
      <button onClick={() => setCounter(counter + 1)}>increment</button>
    </div>
  );
}
