// app/api/auth/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL;

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh token is required." },
      { status: 400 }
    );
  }

  let retryCount = 0;

  while (retryCount < 3) {
    try {
      const response = await axios.post(`${apiUrl}/auth/refresh-tokens`, {
        refreshToken,
      });

      const { access, refresh, user } = response.data;

      return NextResponse.json({
        accessToken: access.token,
        refreshToken: refresh.token,
        aTexpireAt: access.expires,
        rTExpireAt: refresh.expires,
        user,
      });
    } catch (error: any) {
      retryCount++;
      console.error(`Refresh attempt ${retryCount} failed:`, error?.response?.data || error.message);

      if (retryCount === 3) {
        return NextResponse.json(
          { message: "Failed to refresh token after 3 attempts." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.json(
    { message: "Unexpected error." },
    { status: 500 }
  );
}
