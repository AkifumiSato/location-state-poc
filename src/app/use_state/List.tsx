"use client";

import { useState } from "react";

export function List() {
  const [displayList, setDisplayList] = useState(false);
  const list = Array(displayList ? 100 : 0).fill(0);

  return (
    <div>
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
