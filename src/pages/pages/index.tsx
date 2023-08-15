import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Page</h1>
      <p>
        <Link href="/pages/other">/pages/other</Link>
      </p>
      <Counter />
      <List />
    </div>
  );
}
