"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { TrackProps } from "./Track";
import Tracklist from "./Tracklist";

interface PlaylistProps {
  tracks: TrackProps[];
  removeTrack?: (track: TrackProps) => void;
  playlistName?: string;
  setPlaylistName?: (name: string) => void;
}

export default function Playlist({
  tracks,
  removeTrack,
  playlistName,
  setPlaylistName,
}: PlaylistProps) {
  const [isEditing, setIsEditing] = useState(false);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing && h2Ref.current) {
      h2Ref.current.focus();
    }
  }, [isEditing]);

  function handleBlurOrEnter(e: React.KeyboardEvent | React.FocusEvent) {
    e.preventDefault();
    setIsEditing(false);
    if (setPlaylistName && h2Ref.current) {
      setPlaylistName(h2Ref.current.textContent || "");
    }
  }

  async function savePlaylist() {
    console.log("Start saving playlist...");

    // Debug: Log all cookies
    console.log("All cookies:", document.cookie);

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("spotify_access_token="))
      ?.split("=")[1];

    console.log("Raw access token:", accessToken);

    // URL decode the token if it exists
    const decodedToken = accessToken ? decodeURIComponent(accessToken) : null;
    console.log("Decoded access token:", decodedToken);

    if (!decodedToken) {
      console.log("No access token found, redirecting to login");
      router.push("/api/spotify/login");
      return;
    }
    try {
      const response = await fetch("/api/spotify/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistName: playlistName || "New Playlist",
          trackIds: tracks.map((track) => track.id),
        }),
      });

      const data = await response.json();

      console.log("Response:", data);

      if (response.ok) {
        console.log("Playlist saved successfully:", data.playlistId);
      } else {
        console.error("Failed to save playlist:", data.error);
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  }

  return (
    <div className="bg-purple-950 p-6 rounded-lg border border-purple-800 flex flex-col gap-6 items-center justify-between">
      <div className="flex flex-col gap-4 w-full">
        <p className="text-xs uppercase text-white/60 -mb-2">Playlist Name</p>
        <h2
          title="Click to edit"
          ref={h2Ref}
          className="text-2xl font-bold text-white"
          contentEditable={isEditing}
          suppressContentEditableWarning
          tabIndex={0}
          onBlur={handleBlurOrEnter}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (h2Ref.current) h2Ref.current.blur();
              handleBlurOrEnter(e);
            }
          }}
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {playlistName || "New Playlist"}
        </h2>

        <Tracklist tracks={tracks} removeTrack={removeTrack} />
      </div>

      <Button ariaLabel="Save playlist to Spotify" onClick={savePlaylist}>
        Save to Spotify
      </Button>
    </div>
  );
}
