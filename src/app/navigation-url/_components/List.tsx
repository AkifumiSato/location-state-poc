"use client";

import { useLocationState } from "@/lib/locationState/hooks";

export function List() {
  const [displayList, setDisplayList] = useLocationState({
    name: "display-list",
    defaultValue: false,
    storeName: "url",
  });
  const list = Array(displayList ? 100 : 0).fill(0);

  return (
    <div>
      <h3>List</h3>
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
