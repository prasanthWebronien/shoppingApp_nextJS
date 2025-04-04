import { getSession, signIn } from "next-auth/react";

export async function fetchWithAutoRefresh(input: RequestInfo, init?: RequestInit) {
  const session = await getSession();
  const token = session?.user?.aToken;
  const refreshToken = session?.user?.rToken;

  const makeAuthRequest = (accessToken: string | undefined) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  // 🔁 Initial request with current access token
  const res = await makeAuthRequest(token);

  // 🔄 If access token expired (401), try refreshing
 
  if (res.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { newAccessToken, newAccessTokenExpiry } = await refreshResponse.json();

        // ✅ Update the session using `signIn` with trigger "update"
       
        await signIn("credentials", {
          redirect: false,
          login_type: session?.user?.login_type, // You can send anything here
          login_id: session?.user?.email,
          login_name: session?.user?.fname,
          device_type: session?.user?.deviceType,
          aToken: newAccessToken,
          aTexpireAt: newAccessTokenExpiry,
        });

        // 🔄 Get updated session
        const updatedSession = await getSession();

        // 🔁 Retry the original request with new token
        return makeAuthRequest(updatedSession?.user?.aToken);
      } else {
        console.error("Failed to refresh access token");
      }
    } catch (error) {
      console.error("Refresh token request failed", error);
    }
  }

  return res;
}
