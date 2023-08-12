"use client";

import { useLocationState } from "@/lib/locationState/hooks";

export function Counter() {
  const [counter, setCounter] = useLocationState({
    name: "counter",
    defaultValue: 0,
    storeName: "session-store",
  });

  return (
    <div>
      <p>counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>increment</button>
    </div>
  );
}
