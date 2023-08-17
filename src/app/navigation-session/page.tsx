import { Counter } from "@/app/navigation-session/_components/Counter";
import { List } from "@/app/navigation-session/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Navigation session</h1>
      <ul>
        <li>
          <Link href="/navigation-session/static">
            /navigation-session/static
          </Link>
        </li>
        <li>
          <Link href="/navigation-session/dynamic">
            /navigation-session/dynamic
          </Link>
        </li>
      </ul>
      <Counter />
      <List />
    </main>
  );
}
