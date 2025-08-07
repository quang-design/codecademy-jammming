"use client";

import { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import Playlist from "./components/Playlist";
import { TrackProps } from "./components/Track";

export default function Home() {
  const [searchResults, setSearchResults] = useState<TrackProps[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<TrackProps[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  const addTrack = (track: TrackProps) => {
    setSearchResults(searchResults.filter((t) => t.id !== track.id));
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track: TrackProps) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
    setSearchResults([...searchResults, track]);
  };

  const search = useCallback(async (term: string) => {
    try {
      const response = await fetch(
        `/api/spotify?query=${encodeURIComponent(term)}`
      );
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.tracks);
      } else {
        console.error("API error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }, []);

  return (
    <main
      className="bg-cover bg-center bg-no-repeat min-h-screen text-white p-4"
      style={{ backgroundImage: "url(/background_photo_desktop.jpg)" }}
    >
      <section id="search" className="flex items-center justify-center py-12">
        <SearchBar onSearch={search} />
      </section>
      <section
        id="result"
        className="grid grid-cols-1 sm:grid-cols-2 min-h-[calc(100vh-20rem)] gap-4"
      >
        <SearchResult results={searchResults} addTrack={addTrack} />
        <Playlist
          tracks={playlistTracks}
          removeTrack={removeTrack}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
        />
      </section>
    </main>
  );
}
