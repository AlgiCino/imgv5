'use client';
import { useState } from 'react';
import { proxify } from '@/lib/format';
import LuxuryButton from "@/components/ui/LuxuryButton";
export default function Gallery({ images, title }:{ images:string[]; title:string }){
  const [open, setOpen] = useState(false);
  const [curr, setCurr] = useState(0);
  if (!images?.length) return null;
  const proxied = images.map(u=> proxify(u));
  return (<>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {proxied.slice(0,6).map((src,i)=>(<button key={i} onClick={()=>{ setCurr(i); setOpen(true); }} className="relative group"><img src={src} alt={`${title}-${i}`} className="h-44 w-full object-cover rounded-lg border border-gold/20 group-hover:opacity-90"/></button>))}
    </div>
    {open && (<div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center">
      <LuxuryButton 
        variant="outline" 
        size="sm" 
        onClick={()=>setOpen(false)} 
        className="absolute top-4 right-4 w-10 h-10 rounded-full p-0 flex items-center justify-center"
      >
        ✕
      </LuxuryButton>
      <LuxuryButton 
        variant="outline" 
        size="sm" 
        onClick={()=>setCurr((curr-1+proxied.length)%proxied.length)} 
        className="absolute left-4 w-12 h-12 rounded-full p-0 flex items-center justify-center text-2xl"
      >
        ‹
      </LuxuryButton>
      <img src={proxied[curr]} className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg border border-gold/30"/>
      <LuxuryButton 
        variant="outline" 
        size="sm" 
        onClick={()=>setCurr((curr+1)%proxied.length)} 
        className="absolute right-4 w-12 h-12 rounded-full p-0 flex items-center justify-center text-2xl"
      >
        ›
      </LuxuryButton>
    </div>)}
  </>);
}
