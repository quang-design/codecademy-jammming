"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import Playlist from "./components/Playlist";
import { TrackProps } from "./components/Track";

const searchResultsMock: TrackProps[] = [
  {
    id: "1",
    cover: "https://i.pravatar.cc/150?u=1",
    title: "Track 1",
    artist: "Artist 1",
  },
  {
    id: "2",
    cover: "https://i.pravatar.cc/150?u=2",
    title: "Track 2",
    artist: "Artist 2",
  },
];

const playlistTracksMock: TrackProps[] = [
  {
    id: "3",
    cover: "https://i.pravatar.cc/150?u=3",
    title: "Track 3",
    artist: "Artist 3",
  },
];

export default function Home() {
  const [searchResults, setSearchResults] =
    useState<TrackProps[]>(searchResultsMock);
  const [playlistTracks, setPlaylistTracks] =
    useState<TrackProps[]>(playlistTracksMock);

  const addTrack = (track: TrackProps) => {
    setSearchResults(searchResults.filter((t) => t.id !== track.id));
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track: TrackProps) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
    setSearchResults([...searchResults, track]);
  };

  return (
    <main
      className="bg-cover bg-center bg-no-repeat min-h-screen text-white p-4"
      style={{ backgroundImage: "url(/background_photo_desktop.jpg)" }}
    >
      <section id="search" className="flex items-center justify-center py-12">
        <SearchBar />
      </section>
      <section
        id="result"
        className="grid grid-cols-1 sm:grid-cols-2 min-h-[calc(100vh-20rem)] gap-4"
      >
        <SearchResult results={searchResults} addTrack={addTrack} />
        <Playlist tracks={playlistTracks} removeTrack={removeTrack} />
      </section>
    </main>
  );
}
