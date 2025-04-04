import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const authAPIURL = process.env.NEXT_PUBLIC_APP_AUTH_API_URL;

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      personeNumber: string;
      fname?: string;
      sname?: string;
      email?: string;
      aToken?: string;
      rToken?: string;
      aTexpireAt?: number;
      rTExpireAt?: number;
      deviceType: string;
      login_type?: string; // 🔴 Add this
      doorOpend?: boolean;
      storeID?: string;
    };
  }

  interface User {
    id: string;
    personeNumber: string;
    fname?: string;
    sname?: string;
    email?: string;
    aToken: string;
    rToken: string;
    aTexpireAt: number;
    rTExpireAt: number;
    deviceType: string;
    login_type?: string; // 🔴 Add this
    doorOpend?: boolean;
    storeID?: string;
 
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login_type: { label: "Login Type", type: "text" },
        login_id: { label: "Login ID", type: "text" },
        login_name: { label: "Login Name", type: "text" },
        device_type: { label: "Device Type", type: "text" },
      },
      async authorize(credentials) {
        try {

          const loginData = {
            login_type: credentials?.login_type,
            login_id: credentials?.login_id,
            login_name: credentials?.login_name,
            device_type: credentials?.device_type,
          };

          const response = await axios.post(
            `${authAPIURL}/auth/customer-login`,
            loginData,
            {
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (response?.status === 200 && response.data) {
            const { tokens, user } = response.data;

            return {
              id: user?.user_id ?? "",
              personeNumber: user?.bankid ?? "",
              fname: user?.name ?? "",
              sname: user?.name ?? "",
              email: user?.email ?? "",
              rToken: tokens?.refresh?.token ?? "",
              aToken: tokens?.access?.token ?? "",
              rTExpireAt: new Date(tokens?.refresh?.expires).getTime() || 0,
              aTexpireAt: new Date(tokens?.access?.expires).getTime() || 0,
              deviceType: user?.current_device ?? "",
              login_type: loginData.login_type ?? "", // 🟢 Add this here
              doorOpend: false,
              storeID: '',
 
            };

          }

          return null;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Login Error:", error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error("Login Error:", error.message);
          } else {
            console.error("Login Error:", error);
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.personeNumber = user.personeNumber,
        token.fname = user.fname;
        token.sname = user.sname;
        token.email = user.email;
        token.rToken = user.rToken;
        token.aToken = user.aToken;
        token.rTExpireAt = user.rTExpireAt;
        token.aTexpireAt = user.aTexpireAt;
        token.deviceType = user.deviceType;
        token.login_type = user.login_type;
        token.doorOpend = user.doorOpend;
        token.storeId = user.storeID;
      }
      // return token

      // Manual session update from client
      if (trigger === "update" && session) {
        if (session.aToken) token.aToken = session.aToken;
        if (session.aTexpireAt) token.aTexpireAt = session.aTexpireAt;
        if (session.rToken) token.rToken = session.rToken;
        if (session.rTExpireAt) token.rTExpireAt = session.rTExpireAt;
        if (session.doorOpend !== undefined) token.doorOpend = session.doorOpend;
        if (session.storeID) token.storeID = session.storeID;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          personeNumber: token.personeNumber as string,
          fname: token.fname as string,
          sname: token.sname as string,
          email: token.email as string,
          aToken: token.aToken as string,
          rToken: token.rToken as string,
          aTexpireAt: token.aTexpireAt as number,
          rTExpireAt: token.rTExpireAt as number,
          deviceType: token.deviceType as string,
          login_type: token.login_type as string, // ✅ Add this
          doorOpend: token.doorOpend as boolean,
          storeID: token.storeID as string,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "https://shopping.storetech.ai/sapp", // Custom login page
    signOut: 'https://shopping.storetech.ai/sapp',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };