import React from 'react';
import { Music, Sparkles, Heart } from 'lucide-react';
import { CardData } from '../types';

interface RecipientCardProps {
  data: CardData;
  previewMode?: boolean;
}

export const RecipientCard: React.FC<RecipientCardProps> = ({ data, previewMode = false }) => {
  return (
    <article
      className={`relative w-full max-w-md mx-auto overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl rounded-3xl transition-all duration-700 ${previewMode ? 'min-h-[500px] scale-95' : 'min-h-[85vh] my-4 animate-fade-in-up'}`}
      role="article"
      aria-label={`Love card for ${data.recipientName}`}
    >

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-48 h-48 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 sm:p-8 text-center">

        {/* Music Indicator */}
        {data.music && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/50 dark:bg-black/40 px-3 py-2 rounded-full backdrop-blur-md shadow-lg border border-white/30 dark:border-white/10" aria-label={`Playing: ${data.music.name}`}>
            <span className="text-lg">{data.music.icon}</span>
            <span className="text-[10px] sm:text-xs font-medium text-rose-700 dark:text-rose-300">{data.music.name}</span>
            <Music className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400 animate-pulse" />
          </div>
        )}

        {/* Occasion Header */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 mt-4">
          <div className="h-px w-8 bg-rose-300 dark:bg-rose-700" />
          <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-rose-500 dark:text-rose-400 uppercase">
            {data.occasion}
          </h2>
          <div className="h-px w-8 bg-rose-300 dark:bg-rose-700" />
        </div>

        {/* The Bouquet */}
        <div className="relative mb-8 sm:mb-10 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-white dark:from-rose-900/20 dark:to-slate-800/20 rounded-full opacity-50 blur-xl group-hover:blur-2xl transition-all duration-500" />
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 bg-gradient-to-b from-white to-rose-50 dark:from-slate-800 dark:to-slate-900 rounded-full flex flex-wrap items-center justify-center content-center p-4 sm:p-6 shadow-xl border-2 border-rose-100 dark:border-rose-900/30 gap-2 transition-all duration-300" role="img" aria-label="Bouquet of flowers">
            {data.bouquet.length === 0 ? (
               <div className="flex flex-col items-center gap-2">
                 <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-rose-200 dark:text-rose-800 fill-rose-100 dark:fill-rose-900/50" />
                 <Sparkles className="w-6 h-6 text-rose-300 dark:text-rose-700 animate-pulse" />
               </div>
             ) : (
               data.bouquet.map((flower, i) => (
                 <span
                  key={i}
                  className="text-3xl sm:text-4xl select-none hover:scale-125 transition-transform cursor-default"
                  style={{
                    animation: `bounce ${2 + i * 0.15}s infinite`,
                    animationDelay: `${i * 0.1}s`,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                  }}
                  role="img"
                  aria-label={flower.name}
                >
                   {flower.icon}
                 </span>
               ))
             )}
          </div>
           {/* Ribbon simulation */}
           <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-14 bg-gradient-to-b from-rose-400 to-rose-600 opacity-25 dark:opacity-40 blur-lg rounded-full" aria-hidden="true" />
        </div>

        {/* The Poem */}
        <div className="w-full max-w-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 drop-shadow-sm">
            <span className="text-rose-400">❤</span> Dearest {data.recipientName},
          </h1>

          <div className="bg-white/60 dark:bg-black/30 p-5 sm:p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-lg backdrop-blur-sm">
            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 italic font-serif leading-relaxed whitespace-pre-line">
              {data.poem || "No poem written yet..."}
            </p>
          </div>

          {/* Love signature */}
          <div className="mt-6 flex items-center justify-center gap-2 text-rose-400 dark:text-rose-500">
            <Heart className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-sm font-serif italic">With all my love</span>
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </div>
        </div>

        {/* Footer branding */}
        <div className="absolute bottom-4 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest opacity-60">
          <Sparkles className="w-3 h-3" />
          <span>Powered by LoveCard AI</span>
        </div>
      </div>
    </article>
  );
};