import { SessionStrategy } from "next-auth";
import { User } from "next-auth";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" satisfies SessionStrategy,
  },
  callbacks: {
    async signIn({
      account,
      user,
    }: {
      account?: AdapterAccount | null;
      user: User | AdapterUser;
    }) {
      if (!account || !user) return false;

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: "admin",
          avatar: user.image,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
        }),
      });

      if (!response.ok) {
        console.error("Failed to sign in user:", await response.text());
        return false;
      }

      const data = await response.json();
      user.id = data.user._id;
      user.role = data.user.role;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
