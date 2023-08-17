import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Top page</h1>
      <ul>
        <li>
          <Link href="/navigation-session">/navigation-session</Link>
        </li>
        <li>
          <Link href="/navigation-url">/navigation-url</Link>
        </li>
      </ul>
    </main>
  );
}
