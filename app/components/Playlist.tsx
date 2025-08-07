"use client";

import { useState, useRef, useEffect } from "react";
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
    console.log("Saving playlist...");
    const response = await fetch(`/api/spotify/user`);
    const data = await response.json();

    if (response.ok) {
      console.log(data);
    } else {
      console.error("API error:", data.error);
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
