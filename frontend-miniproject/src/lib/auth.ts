import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(user) {
        if (user) return user;
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.refCode = user.refCode;
        token.refBy = user.refBy;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ token, session }: { token: JWT; session: Session }) {
      session.user = {
        id: token.id as number,
        email: token.email as string,
        username: token.username as string,
        fullname: token.fullname as string,
        avatar: token.avatar as string,
        refCode: token.refCode as string,
        refBy: token.refBy as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});