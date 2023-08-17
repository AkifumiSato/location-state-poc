import { Counter } from "@/app/navigation-url/_components/Counter";
import { List } from "@/app/navigation-url/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Navigation session</h1>
      <ul>
        <li>
          <Link href="/navigation-url/static">/navigation-url/static</Link>
        </li>
        <li>
          <Link href="/navigation-url/dynamic">/navigation-url/dynamic</Link>
        </li>
      </ul>
      <Counter />
      <List />
    </main>
  );
}
