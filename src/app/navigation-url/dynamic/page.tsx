import { Counter } from "@/app/navigation-url/_components/Counter";
import { List } from "@/app/navigation-url/_components/List";
import { headers } from "next/headers";
import Link from "next/link";

export default function Page() {
  const headersList = headers();
  const referer = headersList.get("referer");

  return (
    <main>
      <h1>Navigation session - Dynamic page</h1>
      <Link href="/navigation-url">/navigation-url</Link>
      <p>referer: {referer}</p>
      <Counter />
      <List />
    </main>
  );
}
