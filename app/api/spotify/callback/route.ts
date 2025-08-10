import { NextRequest, NextResponse } from "next/server";
import spotify from "@/app/lib/spotify";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const user = await spotify.getCurrentUserProfile(code);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.set("spotify_access_token", code, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
  });

  response.cookies.set("user_id", user.id, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
  });

  return response;
}
