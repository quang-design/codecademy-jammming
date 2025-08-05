"use client";
import { useState } from "react";
import Button from "./Button";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchQuery);
  };

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
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button aria-label="Search for song" className="w-full">
        Search
      </Button>
    </form>
  );
}
