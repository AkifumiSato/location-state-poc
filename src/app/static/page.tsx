import { Counter } from "@/app/_components/Counter";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Static page</h1>
      <Link href="/">/(top)</Link>
      <Counter />
    </main>
  );
}
