import React from 'react';

export default function ProjectsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="h-10 bg-zinc-800 rounded w-1/3 mb-8 animate-pulse"></h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gold/20 bg-black/80 h-96 animate-pulse">
            <div className="h-44 w-full bg-zinc-900" />
            <div className="p-4">
              <div className="h-6 bg-zinc-800 rounded w-2/3 mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-1/2" />
              <div className="mt-4 h-4 bg-zinc-800 rounded" />
              <div className="h-4 bg-zinc-800 rounded w-5/6 mt-2" />
              <div className="mt-6 h-10 bg-gold/20 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
