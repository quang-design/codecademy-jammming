import spotify from "@/app/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await spotify.getCurrentUserProfile();
    return NextResponse.json({ user });
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
