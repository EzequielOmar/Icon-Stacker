import * as trpcNext from "@trpc/server/adapters/next";
import { decode } from "next-auth/jwt";

function getChunkedCookie(req: any, cookieName: string) {
  let chunks = [];
  let chunkIndex = 0;
  let chunkKey = `${cookieName}.${chunkIndex}`;
  while (req.cookies[chunkKey]) {
    chunks.push(req.cookies[chunkKey]);
    chunkIndex++;
    chunkKey = `${cookieName}.${chunkIndex}`;
  }
  if (chunks.length === 0) {
    if (req.cookies[cookieName]) {
      chunks.push(req.cookies[cookieName]);
    }
  }
  return chunks.join("");
}

async function decodeJWT(jwt: string) {
  return await decode({
    token: jwt,
    secret: process.env.NEXTAUTH_SECRET || "",
  });
}

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromCookie() {
    //* Next-auth populates sb-auth-auth-token cookie, with google logged user data (if not in incognito mode)
    //* const googleToken = getChunkedCookie(req, "sb-auth-auth-token");
    //* console.info(googleToken);
    const session = getChunkedCookie(req, "next-auth.session-token");
    const token = await decodeJWT(session);
    if (token) {
      const { sub } = token;
      return { id: sub };
    }
    return null;
  }
  const user = await getUserFromCookie();
  return {
    user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
