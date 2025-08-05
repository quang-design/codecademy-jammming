"use client";

import Image from "next/image";

export interface TrackProps {
  id: string;
  cover: string;
  title: string;
  artist: string;
  onAdd?: () => void;
  onRemove?: () => void;
}

export default function Track({
  id,
  cover,
  title,
  artist,
  onAdd,
  onRemove,
}: TrackProps) {
  return (
    <div
      className="flex items-center gap-4 p-2 border border-purple-800 rounded-lg justify-between"
      key={id}
    >
      <div className="flex items-center gap-2">
        <Image
          src={cover}
          alt={title}
          width={48}
          height={48}
          className="size-12 rounded-lg border border-purple-800 bg-white/10"
        />
        <div className="flex flex-col">
          <h3 className="text-white">{title}</h3>
          <p className="text-sm text-white/60">{artist}</p>
        </div>
      </div>

      {onAdd ? (
        <button
          className="cursor-pointer size-8 rounded-full border border-purple-800 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 transition-colors duration-200"
          onClick={onAdd}
        >
          +
        </button>
      ) : onRemove ? (
        <button
          className="cursor-pointer size-8 rounded-full border border-purple-800 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 transition-colors duration-200"
          onClick={onRemove}
        >
          -
        </button>
      ) : null}
    </div>
  );
}
