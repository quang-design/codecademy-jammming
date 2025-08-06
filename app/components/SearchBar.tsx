"use client";
import { useState, useCallback } from "react";
import Button from "./Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTermChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      onSearch(searchQuery);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    [searchQuery, onSearch]
  );

  return (
    <form
      action=""
      className="flex flex-col gap-4 w-full mx-auto max-w-xl "
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Enter a song title"
        value={searchQuery}
        className="p-4 border border-gray-300 rounded-full bg-white/90 text-black"
        onChange={(e) => {
          handleTermChange(e);
        }}
      />
      <Button aria-label="Search for song" className="w-full">
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
