import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Top page</h1>
      <ul>
        <li>
          <Link href="/static">/static</Link>
        </li>
        <li>
          <Link href="/dynamic">/dynamic</Link>
        </li>
      </ul>
      <Counter />
      <List />
    </main>
  );
}
