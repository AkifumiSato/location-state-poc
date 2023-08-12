import { Counter } from "@/app/_components/Counter";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Top page</h1>
      <Link href="/products">/products</Link>
      <Counter />
    </main>
  );
}
