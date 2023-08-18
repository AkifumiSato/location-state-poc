"use client";

import { useLocationState } from "@/lib/locationState/hooks";
import { StoreName } from "@/lib/locationState/types";

export function List({ storeName }: { storeName: StoreName }) {
  const [displayList, setDisplayList] = useLocationState({
    name: "display-list",
    defaultValue: false,
    storeName,
  });
  const list = Array(displayList ? 100 : 0).fill(0);

  return (
    <div>
      <p>
        storeName: <b>{storeName}</b> List
      </p>
      <label>
        <input
          type="checkbox"
          checked={displayList}
          onChange={(event) => setDisplayList(event.currentTarget.checked)}
        />
        Display List
      </label>
      <ul>
        {list.map((_, index) => (
          <li key={index}>{index}</li>
        ))}
      </ul>
    </div>
  );
}
