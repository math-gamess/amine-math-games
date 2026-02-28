import React from 'react';
import { Zap } from 'lucide-react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${className} bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
        <span className="text-white font-black text-xs">P</span>
      </div>
      <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
        PLR<span className="text-indigo-600">YO</span>
      </span>
    </div>
  );
}
