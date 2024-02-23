import { useRedirectUnauthenticated } from "@/_middlewares/authMiddleware";
import trpc from "@/utils/trpc";
import { signOut, useSession } from "next-auth/react";
import React from "react";

export default function Home() {
  useRedirectUnauthenticated("/signin");
  const { data: session, status } = useSession();

  const all = trpc.all.useQuery();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>home!</div>
      <div>{session?.user?.email}</div>
        <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      {session ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>Not logged in</div>
      )}
      {all.data ? (
        <>
          <span>Data:</span>
          <pre>{JSON.stringify(all.data, null, 2)}</pre>
        </>
      ) : (
        "no data"
      )}
    </>
  );
}
