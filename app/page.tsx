"use client";

import { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import Playlist from "./components/Playlist";
import { TrackProps } from "./components/Track";

export default function Home() {
  const [searchResults, setSearchResults] = useState<TrackProps[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<TrackProps[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  // Load playlist data from localStorage on component mount
  useEffect(() => {
    const savedPlaylistName = localStorage.getItem("playlistName");
    const savedPlaylistTracks = localStorage.getItem("playlistTracks");

    if (savedPlaylistName) {
      setPlaylistName(savedPlaylistName);
    }

    if (savedPlaylistTracks) {
      try {
        const parsedTracks = JSON.parse(savedPlaylistTracks);
        setPlaylistTracks(parsedTracks);
      } catch (error) {
        console.error("Error parsing saved playlist tracks:", error);
      }
    }
  }, []);

  const addTrack = (track: TrackProps) => {
    setSearchResults(searchResults.filter((t) => t.id !== track.id));
    setPlaylistTracks([...playlistTracks, track]);
    localStorage.setItem(
      "playlistTracks",
      JSON.stringify([...playlistTracks, track])
    );
  };

  const removeTrack = (track: TrackProps) => {
    const updatedPlaylistTracks = playlistTracks.filter(
      (t) => t.id !== track.id
    );
    setPlaylistTracks(updatedPlaylistTracks);
    // setSearchResults([...searchResults, track]);
    localStorage.setItem(
      "playlistTracks",
      JSON.stringify(updatedPlaylistTracks)
    );
  };

  const search = useCallback(async (term: string) => {
    const response = await fetch(
      `/api/spotify/search?query=${encodeURIComponent(term)}`
    );
    const data = await response.json();

    if (response.ok) {
      setSearchResults(data.tracks);
    } else {
      console.error("API error:", data.error);
    }
  }, []);

  return (
    <main
      className="bg-cover bg-center bg-no-repeat min-h-screen text-white p-4 pt-16"
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
