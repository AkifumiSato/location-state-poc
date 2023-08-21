import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import Link from "next/link";

export default function Page() {
  // todo: List/Counter move to `src/components`
  return (
    <div>
      <h1>Page</h1>
      <ul>
        <li>
          <Link href="/pages/other">/pages/other</Link>
        </li>
        <li>
          <Link href="/pages/ssr/1">/pages/ssr/1</Link>
        </li>
        <li>
          <Link href="/pages/ssg/1">/pages/ssg/1</Link>
        </li>
      </ul>
      <Counter storeName="session" />
      <List storeName="session" />
    </div>
  );
}
