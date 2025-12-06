import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ProModalProps {
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden border border-white/20 dark:border-slate-800">
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-amber-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Sparkles className="text-amber-500 w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">LoveCard Premium</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
          You have used your free card. Upgrade to Pro for unlimited cards, exclusive 4K flowers, and advanced AI poems.
        </p>
        
        <button className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mb-4 flex items-center justify-center gap-2">
           <Sparkles className="w-5 h-5" />
           Upgrade to Pro ($2.99/mo)
        </button>
        
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 text-xs hover:text-gray-600 dark:hover:text-gray-300 font-medium tracking-wide">
          NO, THANKS
        </button>
      </div>
    </div>
  );
};