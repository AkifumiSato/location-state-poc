import { Counter } from "@/app/navigation-url/_components/Counter";
import { List } from "@/app/navigation-url/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Navigation session - Static page</h1>
      <Link href="/navigation-url">/navigation-url</Link>
      <Counter />
      <List />
    </main>
  );
}
