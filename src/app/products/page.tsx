import { Counter } from "@/app/_components/Counter";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Products</h1>
      <Link href="/">/(top)</Link>
      <Counter />
    </main>
  );
}
