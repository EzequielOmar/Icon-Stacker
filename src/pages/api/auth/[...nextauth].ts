import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User, { publicUser } from "@/server/db/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || "",
    }),
    {
      id: "authentication",
      name: "authentication",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req): Promise<any> => {
        const user: publicUser | null = await User.checkUserByEmailAndPassword(
          credentials?.email || "",
          credentials?.password || ""
        );
        return user ? user : Promise.resolve(null);
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }: any): Promise<any> {
      if (user && user.last_name) {
        token.last_name = user.last_name;
      }
      return token;
    },
    async session({ session, token, user }: any): Promise<any> {
      if (token.last_name) {
        session.user.last_name = token.last_name;
      }
      return session;
    },
    async signIn({ account, profile, user }: any) {
      if (account.provider === "google") {
        try {
          let exists: publicUser | null = await User.checkUserByEmail(
            profile.email
          );
          if (!exists) {
            exists = await User.createProviderUser(
              profile.email,
              profile.given_name,
              profile.family_name,
              profile.picture
            );
          }
          user.id = exists.id;
          user.name = exists.name;
          user.last_name = exists.last_name;
          return user;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
