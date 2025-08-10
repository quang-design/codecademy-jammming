import { NextRequest, NextResponse } from "next/server";
import spotify from "@/app/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    const { playlistName, trackIds } = await request.json();

    const accessToken = request.cookies.get("spotify_access_token")?.value;
    const userId = request.cookies.get("user_id")?.value;

    if (!accessToken || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    spotify.setAccessToken(accessToken);

    const playlistId = await spotify.createPlaylist(userId, playlistName);

    await spotify.addItemsToPlaylist(playlistId, trackIds);

    return NextResponse.json({ success: true, playlistId });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
