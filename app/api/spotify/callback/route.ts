import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // Step 1: Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri:
            process.env.SPOTIFY_REDIRECT_URI ||
            `${request.nextUrl.origin}/api/spotify/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Step 2: Get user profile using the actual access token
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user profile" },
        { status: 400 }
      );
    }

    const user = await userResponse.json();

    // Step 3: Set cookies with the actual access token
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: expires_in, // Use the actual token expiration time
      path: "/",
    });

    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    // Optional: Store refresh token for token renewal
    if (refresh_token) {
      response.cookies.set("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
