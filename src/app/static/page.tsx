import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Static page</h1>
      <Link href="/">/(top)</Link>
      <Counter />
      <List />
    </main>
  );
}
