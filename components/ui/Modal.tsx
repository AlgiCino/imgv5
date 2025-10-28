'use client';
import { ReactNode, useEffect } from 'react';
import LuxuryButton from '@/components/ui/LuxuryButton';
export default function Modal({ open, onClose, children, title }:{ open:boolean; onClose:()=>void; children: ReactNode; title?:string }){
  useEffect(()=>{ if(!open) return; const onKey=(e:KeyboardEvent)=> e.key==='Escape' && onClose(); document.addEventListener('keydown',onKey); return ()=>document.removeEventListener('keydown',onKey); },[open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-black border border-gold/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gold/20">
          <div className="text-gold font-semibold">{title}</div>
          <LuxuryButton variant="outline" size="sm" onClick={onClose} className="text-gold hover:text-light transition p-2 min-w-0">✕</LuxuryButton>
        </div>
        <div className="p-0 h-[70vh] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
