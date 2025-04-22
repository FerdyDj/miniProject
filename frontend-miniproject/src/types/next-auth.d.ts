import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      fullname?: string;
      username?: string;
      email?: string;
      avatar?: string;
      refCode?: string;
      refBy?: string;
      role?: string;
    };
    accessToken?: string;
  }

  interface JWT {
    id?: number;
    fullname?: string;
    username?: string;
    email?: string;
    avatar?: string;
    refCode?: string;
    refBy?: string;
    role?: string;
    accessToken?: string;
  }

  interface User {
    id?: number;
    fullname?: string;
    username?: string;
    email?: string;
    avatar?: string;
    refCode?: string;
    refBy?: string;
    role?: string;
    accessToken?: string;
  }
}