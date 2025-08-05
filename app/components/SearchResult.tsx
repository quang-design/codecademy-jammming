"use client";

import Tracklist from "./Tracklist";
import { TrackProps } from "./Track";

interface SearchResultProps {
  results?: TrackProps[];
  addTrack?: (track: TrackProps) => void;
}

export default function SearchResult({ results, addTrack }: SearchResultProps) {
  return (
    <div
      className="bg-purple-950 p-6 rounded-lg border border-purple-800"
      aria-live="polite"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Results</h2>

      {results && results.length > 0 ? (
        <Tracklist tracks={results} addTrack={addTrack} />
      ) : (
        <p className="text-purple-200">No result found</p>
      )}
    </div>
  );
}
