import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import { headers } from "next/headers";
import Link from "next/link";

export default function Page() {
  const headersList = headers();
  const referer = headersList.get("referer");

  return (
    <main>
      <h1>Navigation session - Dynamic page</h1>
      <Link href="/navigation-session">/navigation-session</Link>
      <p>referer: {referer}</p>
      <Counter />
      <List />
    </main>
  );
}
