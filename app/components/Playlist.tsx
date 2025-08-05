"use client";

import Button from "./Button";
import { TrackProps } from "./Track";
import Tracklist from "./Tracklist";

interface PlaylistProps {
  tracks: TrackProps[];
  removeTrack?: (track: TrackProps) => void;
}

export default function Playlist({ tracks, removeTrack }: PlaylistProps) {
  return (
    <div className="bg-purple-950 p-6 rounded-lg border border-purple-800 flex flex-col gap-6 items-center justify-between">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold text-white">New Playlist</h2>
        <Tracklist tracks={tracks} removeTrack={removeTrack} />
      </div>

      <Button ariaLabel="Save playlist to Spotify">Save to Spotify</Button>
    </div>
  );
}
