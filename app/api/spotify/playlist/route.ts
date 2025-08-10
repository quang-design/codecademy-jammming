import { NextRequest, NextResponse } from "next/server";
import spotify from "@/app/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("spotify_access_token")?.value;
    const userId = request.cookies.get("user_id")?.value;

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in again." },
        { status: 401 }
      );
    }

    const { playlistName, tracks } = await request.json();

    if (!playlistName || !tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: "Missing playlist name or tracks" },
        { status: 400 }
      );
    }

    spotify.setAccessToken(accessToken);

    const playlistId = await spotify.createPlaylist(userId, playlistName);

    const result = await spotify.addItemsToPlaylist(playlistId, tracks);

    if (!result || !result.snapshot_id) {
      return NextResponse.json(
        {
          error: "Failed to add tracks to playlist",
          success: false,
          playlistId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      playlistId,
      snapshotId: result.snapshot_id,
    });
  } catch (error) {
    console.error("Error saving playlist:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
