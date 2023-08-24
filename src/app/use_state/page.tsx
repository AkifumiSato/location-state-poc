import { Counter } from "./Counter";
import { List } from "./List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Static page</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <Link href="/">/(top)</Link>
        <Counter />
        <List />
      </div>
    </main>
  );
}
