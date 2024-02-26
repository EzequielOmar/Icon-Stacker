import { useRedirectUnauthenticated } from "@/hooks/useRedirect";
import trpc from "@/utils/trpc";
import { getSession, signOut, useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { AppRouter, appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/_context";
import * as trpcNext from "@trpc/server/adapters/next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ctx = await createContext({
    req: context.req,
    res: context.res,
  } as trpcNext.CreateNextContextOptions);
  if (!ctx.user)
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  const helpers = createServerSideHelpers<AppRouter>({
    router: appRouter,
    ctx: ctx,
  });
  await helpers.allBookmarks.prefetch();
  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  useRedirectUnauthenticated("/signin");
  const { data: session, status } = useSession();
  const [bookmarks, bookmarkQueries] = trpc.allBookmarks.useSuspenseQuery();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const mutation = trpc.newBookmark.useMutation({
    onSuccess: () => {
      setUrl("");
      setError("");
      bookmarkQueries.refetch();
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ url });
  };

  return (
    <>
      <div>home!</div>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>

      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Add Bookmark</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {bookmarks?.length ? (
        <>
          <span>Data:</span>
          <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
        </>
      ) : (
        "no data"
      )}
    </>
  );
}
