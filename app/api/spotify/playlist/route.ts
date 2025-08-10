import { NextRequest, NextResponse } from "next/server";
import spotify from "@/app/lib/spotify";

export async function POST(request: NextRequest) {
  const { playlistName, tracks, accessToken, userId } = await request.json();

  spotify.setAccessToken(accessToken);

  const playlistId = await spotify.createPlaylist(userId, playlistName);

  const snapshotId = await spotify.addItemsToPlaylist(playlistId, tracks);

  if (!snapshotId) {
    return NextResponse.json({ success: false, playlistId });
  }

  return NextResponse.json({ success: true, playlistId, snapshotId });
}
