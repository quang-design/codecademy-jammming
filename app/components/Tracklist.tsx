"use client";

import Track from "./Track";
import { TrackProps } from "./Track";

interface TracklistProps {
  tracks?: TrackProps[];
  addTrack?: (track: TrackProps) => void;
  removeTrack?: (track: TrackProps) => void;
}

export default function Tracklist({
  tracks,
  addTrack,
  removeTrack,
}: TracklistProps) {
  return (
    <div className="flex gap-4 w-full flex-col-reverse">
      {tracks && tracks.length > 0 ? (
        tracks.map((track, index) => (
          <Track
            key={index}
            id={track.id}
            cover={track.cover}
            title={track.title}
            artist={track.artist}
            onAdd={addTrack ? () => addTrack(track) : undefined}
            onRemove={removeTrack ? () => removeTrack(track) : undefined}
          />
        ))
      ) : (
        <p className="text-purple-200 text-center">No tracks available</p>
      )}
    </div>
  );
}
