import { Counter } from "@/app/_components/Counter";
import { List } from "@/app/_components/List";
import { GetServerSideProps, GetStaticPaths } from "next";
import Link from "next/link";

type Props = {
  id: number;
};

export default function Page({ id }: Props) {
  const nextUrl = `/pages/ssr/${id + 1}`;
  return (
    <div>
      <h1>SSR Page</h1>
      <p>id: {id}</p>
      <p>
        <Link href="/pages">/pages</Link>
      </p>
      <p>
        <Link href={nextUrl}>{nextUrl}</Link>
      </p>
      <Counter storeName="session" />
      <List storeName="session" />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: Array.from({ length: 10 }, (_, i) => ({
      params: { id: String(i) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  return {
    props: {
      id: Number(params?.id),
    },
  };
};
