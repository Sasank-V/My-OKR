// next-auth.d.ts

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  }
  interface AdapterUser {
    name?: string;
    role?: string;
  }

  interface Session {
    user: User;
  }
}
