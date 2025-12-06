
import React from 'react';
import { Heart, Music, Sparkles, Flower } from 'lucide-react';

export const BackgroundPattern = () => {
  // Create a grid of icons to tile the background
  const icons = Array(40).fill(0).map((_, i) => {
    const Type = [Heart, Music, Sparkles, Flower][i % 4];
    return {
      id: i,
      Icon: Type,
      // Randomize position slightly within grid cells to look natural
      offsetX: Math.random() * 20 - 10, 
      offsetY: Math.random() * 20 - 10,
      size: Math.random() * 20 + 20, // 20px to 40px
      rotation: Math.random() * 360,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Container that moves */}
      <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.03] dark:opacity-[0.05] animate-scrolling-background flex flex-wrap content-center justify-center gap-16 sm:gap-24 transform -rotate-12">
        {icons.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-center text-rose-900 dark:text-rose-100"
            style={{
              width: '100px',
              height: '100px',
              transform: `translate(${item.offsetX}px, ${item.offsetY}px) rotate(${item.rotation}deg)`
            }}
          >
            <item.Icon size={item.size} fill="currentColor" />
          </div>
        ))}
      </div>
      
      {/* Gradient Overlay to fade edges and soften the pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50/80 via-transparent to-pink-100/80 dark:from-slate-950/90 dark:via-slate-900/50 dark:to-slate-950/90" />
    </div>
  );
};
