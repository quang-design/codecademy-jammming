import { getSpotifyTrack } from "@/app/lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const tracks = await getSpotifyTrack(query);
    return NextResponse.json({ tracks });
  } catch (error: unknown) {
    console.error("Spotify API error:", error);

    // Handle different types of errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle non-Error objects
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
