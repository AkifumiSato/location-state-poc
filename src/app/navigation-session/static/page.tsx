import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Navigation session - Static page</h1>
      <Link href="/navigation-session">/navigation-session</Link>
      <Counter />
      <List />
    </main>
  );
}