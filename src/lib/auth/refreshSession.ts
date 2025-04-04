import { signIn, getSession } from "next-auth/react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL;

interface TokenData {
  token: string;
  expires: string; // or Date, depending on your backend
}

interface RefreshResponse {
  access: TokenData;
  refresh: TokenData;
}

export const refreshSession = async (refreshToken: string): Promise<RefreshResponse  | null> => {
  let retryCount = 0;

  while (retryCount < 3) {
    try {
      const response = await axios.post(`${apiUrl}/auth/refresh-tokens`, {
        refreshToken,
      });

      const { access, refresh } = response.data;

      const session = await getSession();
      const user = session?.user;

      if (!user) {
        console.error("No session user found.");
        return access;
      }

      let storeID=localStorage.getItem('storeID') || '';

      // 🟢 Use signIn with trigger: "update" to refresh tokens in session
      const updated = await signIn("credentials", {
        redirect: false,
        login_type: user.login_type,
        login_id: user.email,
        login_name: user.fname,
        device_type: user.deviceType,
        aToken: access.token,
        aTexpireAt: new Date(access.expires).getTime(),
        rToken: refresh.token,
        rTExpireAt: new Date(refresh.expires).getTime(),
        trigger: "update", // custom logic in NextAuth JWT callback
      });
 
      console.log(updated);
      localStorage.setItem('storeID',storeID);
      if (updated?.ok) {
        return response.data;
      } else {
        console.error("Session update failed.");
        return null;
      }
    } catch (error) {
      retryCount++;
      console.error(`❌ Token refresh failed. Attempt ${retryCount}:`, error);

      if (retryCount === 3) {
        console.error("⚠️ Failed to refresh token after 3 attempts.");
        // Optionally redirect to login
        // window.location.href = "/login";
        return null;
      }
    }
  }

  return null;
};
