
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ArrowRight, ArrowLeft, Sparkles, Copy, Share2, Music, Check, RotateCcw, MessageCircle, Moon, Sun, ThumbsUp, Globe, Smartphone, X, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { FLOWERS, MUSIC_TRACKS, CardData, Flower, AppStep, GalleryItem } from './types';
import { generatePoem } from './services/geminiService';
import { RecipientCard } from './components/RecipientCard';
import { ProModal } from './components/ProModal';
import { BackgroundPattern } from './components/BackgroundPattern';
import { TRANSLATIONS } from './locales';

type LangCode = 'en' | 'tr';

// Mock Data for Community Gallery
const COMMUNITY_CARDS: GalleryItem[] = [
  { 
    id: 101, likes: 842, recipientName: "Sarah", occasion: "Valentine's Day", 
    poem: "Roses are red, violets are blue...", 
    bouquet: [FLOWERS[0], FLOWERS[3], FLOWERS[4]], music: MUSIC_TRACKS[0] 
  },
  { 
    id: 102, likes: 621, recipientName: "Michael", occasion: "Anniversary", 
    poem: "Three years of joy, a lifetime to go...", 
    bouquet: [FLOWERS[2], FLOWERS[5]], music: MUSIC_TRACKS[2] 
  },
];

export default function App() {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [usageCount, setUsageCount] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<LangCode>('en');
  
  // Shortcuts
  const t = TRANSLATIONS[lang];
  const occasionKeys = Object.keys(TRANSLATIONS['en'].occasions) as Array<keyof typeof TRANSLATIONS['en']['occasions']>;
  const flowerKeys = Object.keys(TRANSLATIONS['en'].flowers) as Array<keyof typeof TRANSLATIONS['en']['flowers']>;

  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>(COMMUNITY_CARDS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEditingPoem, setIsEditingPoem] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nameError, setNameError] = useState('');

  const [formData, setFormData] = useState<CardData>({
    recipientName: "",
    occasion: t.occasions.valentine,
    bouquet: [],
    poem: "",
    music: null,
  });

  // Effects
  useEffect(() => {
    setFormData(prev => ({ ...prev, occasion: t.occasions.valentine }));
  }, [lang]);

  useEffect(() => {
    const storedCount = localStorage.getItem('loveCardUsage');
    if (storedCount) setUsageCount(parseInt(storedCount, 10));

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Reset scroll when step changes inside the frame
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  // Handlers
  const handleStart = () => {
    if (usageCount >= 1) {
      setShowProModal(true);
    } else {
      setStep(AppStep.DETAILS);
    }
  };

  const handleUpdate = (field: keyof CardData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFlower = (flower: Flower) => {
    const exists = formData.bouquet.find(f => f.id === flower.id);
    if (exists) {
      handleUpdate('bouquet', formData.bouquet.filter(f => f.id !== flower.id));
    } else {
      if (formData.bouquet.length < 9) {
        handleUpdate('bouquet', [...formData.bouquet, flower]);
      }
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.recipientName) return;
    setIsGenerating(true);
    
    const flowerNames = formData.bouquet.map(f => {
      const key = flowerKeys[f.id - 1];
      return key ? t.flowers[key] : f.name;
    });

    try {
      const poem = await generatePoem(formData.recipientName, formData.occasion, flowerNames, lang);
      handleUpdate('poem', poem);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('loveCardUsage', newCount.toString());
    setStep(AppStep.PREVIEW);
  };

  const handleWhatsappShare = () => {
    const text = lang === 'tr'
      ? `Sana özel bir kart hazırladım! ❤️ Bak: https://lovecard.ai/view?id=${encodeURIComponent(formData.recipientName)}`
      : `I created a special card for you! ❤️ Check it out: https://lovecard.ai/view?id=${encodeURIComponent(formData.recipientName)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = async () => {
    const link = `https://lovecard.ai/view?id=${encodeURIComponent(formData.recipientName)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError(lang === 'tr' ? 'Lütfen bir isim girin' : 'Please enter a name');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError(lang === 'tr' ? 'İsim en az 2 karakter olmalı' : 'Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleUpdate('recipientName', value);
    if (nameError) validateName(value);
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'tr' : 'en');

  // --- RENDERERS ---

  const renderHeader = () => (
    <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 transition-colors duration-300" role="banner">
      <button
        onClick={() => setStep(step === AppStep.LANDING ? AppStep.LANDING : step - 1)}
        disabled={step === AppStep.LANDING}
        className={`p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${step === AppStep.LANDING ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
        aria-label={lang === 'tr' ? 'Geri' : 'Go back'}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {step === AppStep.LANDING ? (
        <span className="font-serif font-bold text-lg text-rose-500 flex items-center gap-1">
           LoveCard.ai
        </span>
      ) : (
        <div className="flex items-center gap-1">
           {[1, 2, 3].map(s => {
              const isCompleted = s < step;
              const isCurrent = s === step;
              const stepLabels = lang === 'tr'
                ? ['Detaylar', 'Buket', 'AI Stüdyo']
                : ['Details', 'Bouquet', 'AI Studio'];
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-rose-500 text-white'
                          : isCurrent
                          ? 'bg-rose-500 text-white ring-4 ring-rose-200 dark:ring-rose-900/50'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s}
                    </div>
                    <span className={`text-[9px] mt-1 font-medium transition-colors ${
                      isCurrent ? 'text-rose-500' : 'text-gray-400 dark:text-slate-500'
                    }`}>
                      {stepLabels[s - 1]}
                    </span>
                  </div>
                  {s < 3 && (
                    <div className={`w-6 h-0.5 mx-1 mt-[-12px] transition-colors ${
                      isCompleted ? 'bg-rose-500' : 'bg-gray-200 dark:bg-slate-700'
                    }`} />
                  )}
                </div>
              );
           })}
        </div>
      )}

      <div className="flex gap-1" role="group" aria-label={lang === 'tr' ? 'Ayarlar' : 'Settings'}>
        <button
          onClick={toggleLang}
          className="px-2 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition uppercase focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label={lang === 'tr' ? 'Dil değiştir' : 'Change language'}
        >
          {lang === 'en' ? '🇺🇸' : '🇹🇷'} {lang.toUpperCase()}
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg text-gray-500 dark:text-yellow-500 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label={isDarkMode ? (lang === 'tr' ? 'Açık mod' : 'Light mode') : (lang === 'tr' ? 'Koyu mod' : 'Dark mode')}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );

  const renderFooter = () => {
    const isDisabled = (step === 1 && (!formData.recipientName || formData.recipientName.trim().length < 2)) || (step === 3 && !formData.poem) || isGenerating;
    const getHelpText = () => {
      if (step === 1 && !formData.recipientName) return lang === 'tr' ? 'İsim giriniz' : 'Enter a name';
      if (step === 1 && formData.recipientName.trim().length < 2) return lang === 'tr' ? 'En az 2 karakter' : 'At least 2 characters';
      if (step === 3 && !formData.poem) return lang === 'tr' ? 'Önce şiir oluşturun' : 'Generate a poem first';
      return null;
    };
    const helpText = getHelpText();

    return (
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 z-20 pt-10" role="contentinfo">
        {helpText && isDisabled && (
          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mb-2 animate-pulse">
            {helpText}
          </p>
        )}
        <button
          onClick={step === 3 ? handleFinish : () => setStep(step + 1)}
          disabled={isDisabled}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] text-lg focus:outline-none focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-900 ${
            isDisabled
            ? 'bg-gray-300 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-200 dark:shadow-none hover:shadow-xl'
          }`}
          aria-label={step === 3 ? t.finishCard : t.continue}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>{lang === 'tr' ? 'Bekleyin...' : 'Please wait...'}</span>
            </>
          ) : (
            <>
              {step === 3 ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t.finishCard}
                </>
              ) : (
                <>
                  {t.continue}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </>
          )}
        </button>
      </footer>
    );
  };

  // Content for each step
  const renderStepContent = () => {
    switch (step) {
      case AppStep.LANDING:
        return (
          <div className="flex flex-col items-center justify-center min-h-full py-12 px-6 text-center" role="main">
            {/* Hero Section */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-400 blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl rotate-3 border border-rose-50 dark:border-rose-900/30 hover:rotate-0 transition-transform duration-500">
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
              {/* Decorative sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
              <Sparkles className="absolute -bottom-1 -left-3 w-4 h-4 text-rose-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3 font-serif tracking-tight">
              LoveCard<span className="text-rose-500">.ai</span>
            </h1>

            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto leading-relaxed">
              {lang === 'tr'
               ? "Yapay zeka ile duygularını ifade et, en romantik kartı sen hazırla."
               : "Express your feelings with AI, create the most romantic card."}
            </p>

            {/* Features list */}
            <div className="flex justify-center gap-4 mb-8 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>{lang === 'tr' ? 'AI Şiir' : 'AI Poem'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3 text-rose-400" />
                <span>{lang === 'tr' ? 'Müzik' : 'Music'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>{lang === 'tr' ? 'Çiçekler' : 'Flowers'}</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 dark:shadow-none hover:from-rose-600 hover:to-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-900"
              aria-label={t.createFreeCard}
            >
              <Sparkles className="w-5 h-5" />
              {t.createFreeCard}
            </button>

            {/* Free trial indicator */}
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              {t.freeTrial}
            </p>

            {/* Community Gallery */}
            <div className="mt-8 w-full">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                   <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                   {t.communityFavorites}
                 </h3>
                 <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">{t.topRated}</span>
              </div>

              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-6 px-6 no-scrollbar" role="list" aria-label={t.communityFavorites}>
                {gallery.map((item) => (
                  <article key={item.id} className="snap-center shrink-0 w-48 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/50 transition-all cursor-pointer" role="listitem">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-rose-400 uppercase">{item.occasion}</span>
                      <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                        <ThumbsUp className="w-3 h-3" /> {item.likes}
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm truncate">{lang === 'tr' ? 'Kime' : 'To'}: {item.recipientName}</p>
                    <div className="flex gap-1 mt-2">
                       {item.bouquet.slice(0, 4).map((f, i) => <span key={i} className="text-sm">{f.icon}</span>)}
                       {item.bouquet.length > 4 && <span className="text-[10px] text-gray-400">+{item.bouquet.length - 4}</span>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );

      case AppStep.DETAILS:
        return (
          <div className="pt-24 px-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">{t.letsStart}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{t.whoIsFor}</p>

            <div className="space-y-5">
              <div>
                <label htmlFor="recipient-name" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t.nameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="recipient-name"
                    type="text"
                    value={formData.recipientName}
                    onChange={handleNameChange}
                    onBlur={() => validateName(formData.recipientName)}
                    className={`w-full p-4 pr-12 rounded-xl border-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none transition text-lg ${
                      nameError
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : formData.recipientName.trim().length >= 2
                        ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                        : 'border-gray-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    }`}
                    placeholder={t.namePlaceholder}
                    autoFocus
                    aria-describedby={nameError ? 'name-error' : undefined}
                    aria-invalid={!!nameError}
                    maxLength={50}
                  />
                  {formData.recipientName.trim().length >= 2 && !nameError && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {nameError && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {nameError && (
                  <p id="name-error" className="mt-2 text-sm text-red-500 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {nameError}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                  {formData.recipientName.length}/50 {lang === 'tr' ? 'karakter' : 'characters'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t.occasionLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {occasionKeys.map((key) => {
                    const occText = t.occasions[key];
                    const isSelected = formData.occasion === occText;
                    return (
                      <button
                        key={key}
                        onClick={() => handleUpdate('occasion', occText)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          isSelected 
                          ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/30 dark:border-rose-500 dark:text-rose-300' 
                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {occText}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case AppStep.BOUQUET:
        return (
          <div className="pt-24 px-6 pb-32 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 font-serif">{t.designBouquet}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.bouquetInstruction}</p>
              </div>
              {/* Flower counter badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                formData.bouquet.length >= 9
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {formData.bouquet.length}/9
              </div>
            </div>

            {/* Bouquet Visualizer */}
            <div className="relative mb-6 group shrink-0" role="region" aria-label={lang === 'tr' ? 'Seçilen çiçekler' : 'Selected flowers'}>
               <div className="absolute inset-0 bg-rose-200 dark:bg-rose-900/20 blur-2xl rounded-full opacity-30"></div>
               <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] h-52 border-2 border-dashed border-rose-100 dark:border-slate-700 flex flex-wrap items-center justify-center p-4 content-center gap-1 shadow-sm overflow-hidden transition-colors">
                  {formData.bouquet.length === 0 && (
                    <div className="text-center text-gray-300 dark:text-slate-600 flex flex-col items-center animate-pulse">
                       <Heart className="w-10 h-10 mb-2" />
                       <span className="text-xs font-medium uppercase tracking-wide">{t.emptyBasket}</span>
                       <span className="text-[10px] mt-1 opacity-60">{lang === 'tr' ? 'Aşağıdan çiçek seçin' : 'Select flowers below'}</span>
                    </div>
                  )}
                  {formData.bouquet.map((flower, idx) => (
                    <button
                      key={`${flower.id}-${idx}`}
                      onClick={() => toggleFlower(flower)}
                      className="text-4xl hover:scale-125 active:scale-75 transition-transform animate-in zoom-in duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 rounded-lg"
                      aria-label={`${lang === 'tr' ? 'Kaldır' : 'Remove'}: ${flower.name}`}
                      title={`${lang === 'tr' ? 'Kaldırmak için tıkla' : 'Click to remove'}`}
                    >
                      {flower.icon}
                    </button>
                  ))}
               </div>
               {formData.bouquet.length > 0 && (
                  <button
                    onClick={() => handleUpdate('bouquet', [])}
                    className="absolute -bottom-3 right-4 bg-white dark:bg-slate-700 text-xs text-rose-500 dark:text-rose-400 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-600 hover:bg-rose-50 dark:hover:bg-slate-600 transition flex items-center gap-1"
                    aria-label={lang === 'tr' ? 'Tümünü temizle' : 'Clear all'}
                  >
                    <X className="w-3 h-3" />
                    {lang === 'tr' ? 'Temizle' : 'Clear'}
                  </button>
               )}
            </div>

            {/* Scrollable Grid */}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto no-scrollbar pb-4" role="listbox" aria-label={lang === 'tr' ? 'Çiçek seçenekleri' : 'Flower options'}>
              {FLOWERS.map((flower, index) => {
                const isSelected = formData.bouquet.find(f => f.id === flower.id);
                const flowerKey = flowerKeys[index];
                const isMaxReached = formData.bouquet.length >= 9 && !isSelected;

                return (
                  <button
                    key={flower.id}
                    onClick={() => toggleFlower(flower)}
                    disabled={isMaxReached}
                    role="option"
                    aria-selected={!!isSelected}
                    className={`p-2 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${
                      isSelected
                      ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-400 shadow-md scale-[1.02]'
                      : isMaxReached
                      ? 'bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-rose-300 hover:shadow-md active:scale-95'
                    }`}
                  >
                    <span className={`text-3xl filter drop-shadow-sm transition-transform ${isSelected ? 'scale-110' : ''}`}>{flower.icon}</span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase text-center leading-tight">{flowerKey ? t.flowers[flowerKey] : flower.name}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        );

      case AppStep.AI_STUDIO:
        return (
          <div className="pt-24 px-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">{t.aiStudio}</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{t.aiInstruction}</p>

             {/* Result Card */}
             <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 relative overflow-hidden min-h-[180px] flex flex-col justify-center">
               {isGenerating ? (
                 <div className="flex flex-col items-center justify-center space-y-3">
                   <div className="relative">
                     <Sparkles className="w-10 h-10 text-rose-500 animate-spin" />
                     <div className="absolute inset-0 bg-rose-500 blur-xl opacity-30 animate-pulse" />
                   </div>
                   <p className="text-rose-500 text-xs font-bold animate-pulse uppercase tracking-widest">{t.aiGenerating}</p>
                   <div className="flex gap-1 mt-2">
                     {[0, 1, 2].map(i => (
                       <div
                         key={i}
                         className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                         style={{ animationDelay: `${i * 0.15}s` }}
                       />
                     ))}
                   </div>
                 </div>
               ) : formData.poem ? (
                 <>
                   <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-slate-700 pb-2">
                     <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                       <Sparkles className="w-3 h-3 text-yellow-500" />
                       {t.aiPoemTitle}
                     </h3>
                     <div className="flex gap-2">
                       <button
                         onClick={() => setIsEditingPoem(!isEditingPoem)}
                         className={`p-1.5 rounded-lg transition ${isEditingPoem ? 'bg-rose-100 text-rose-500 dark:bg-rose-900/30' : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                         title={lang === 'tr' ? 'Şiiri Düzenle' : 'Edit Poem'}
                         aria-label={lang === 'tr' ? 'Şiiri Düzenle' : 'Edit Poem'}
                       >
                          <Edit3 className="w-4 h-4" />
                       </button>
                       <button
                         onClick={handleGenerateAI}
                         className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                         title={lang === 'tr' ? 'Yeniden Oluştur' : 'Regenerate'}
                         aria-label={lang === 'tr' ? 'Yeniden Oluştur' : 'Regenerate'}
                       >
                          <RotateCcw className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                   {isEditingPoem ? (
                     <div className="space-y-3">
                       <textarea
                         value={formData.poem}
                         onChange={(e) => handleUpdate('poem', e.target.value)}
                         className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 italic font-serif text-sm leading-relaxed resize-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/50 outline-none transition"
                         rows={6}
                         placeholder={lang === 'tr' ? 'Şiirinizi buraya yazın...' : 'Write your poem here...'}
                         aria-label={lang === 'tr' ? 'Şiir metni' : 'Poem text'}
                       />
                       <div className="flex justify-between items-center">
                         <span className="text-xs text-gray-400">{formData.poem.length} {lang === 'tr' ? 'karakter' : 'chars'}</span>
                         <button
                           onClick={() => setIsEditingPoem(false)}
                           className="text-xs font-bold text-rose-500 hover:text-rose-600 transition flex items-center gap-1"
                         >
                           <Check className="w-3 h-3" />
                           {lang === 'tr' ? 'Tamam' : 'Done'}
                         </button>
                       </div>
                     </div>
                   ) : (
                     <p className="text-gray-700 dark:text-gray-300 italic font-serif text-sm leading-relaxed whitespace-pre-line">
                       {formData.poem}
                     </p>
                   )}
                 </>
               ) : (
                 <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-rose-500" />
                    </div>
                    <p className="text-gray-400 dark:text-slate-500 text-xs">
                      {lang === 'tr' ? 'Çiçeklerinize ve güne özel şiir' : 'Poem tailored to your flowers & occasion'}
                    </p>
                    <button
                      onClick={handleGenerateAI}
                      className="bg-gradient-to-r from-rose-500 to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                      {t.writeMagicPoem}
                    </button>
                 </div>
               )}
             </div>

             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">{t.backgroundMusic}</h3>
             <div className="space-y-2">
               {MUSIC_TRACKS.map(track => (
                 <button
                   key={track.id}
                   onClick={() => handleUpdate('music', track)}
                   className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border ${
                     formData.music?.id === track.id 
                     ? 'bg-white dark:bg-slate-800 border-rose-400 ring-1 ring-rose-400' 
                     : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
                   }`}
                 >
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${track.color}`}>
                     {track.icon}
                   </div>
                   <div className="flex-1 text-left">
                     <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{track.name}</div>
                   </div>
                   {formData.music?.id === track.id && <Check className="w-4 h-4 text-rose-500" />}
                 </button>
               ))}
             </div>
          </div>
        );

      case AppStep.PREVIEW:
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 animate-in zoom-in duration-500">
             <div className="text-center mb-4">
               <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-3">
                 <CheckCircle className="w-4 h-4" />
                 <span className="text-xs font-bold">{lang === 'tr' ? 'Kart Hazır!' : 'Card Ready!'}</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{t.looksAmazing}</h2>
               <p className="text-gray-500 dark:text-gray-400 text-sm">{t.readyToShare}</p>
             </div>

             <div
               className="w-full aspect-[3/4] max-h-[350px] mb-4 shadow-2xl rounded-2xl overflow-hidden border-4 border-white dark:border-slate-700 cursor-pointer hover:scale-[1.02] transition-transform"
               onClick={() => setStep(AppStep.RECIPIENT_VIEW)}
               role="button"
               tabIndex={0}
               onKeyDown={(e) => e.key === 'Enter' && setStep(AppStep.RECIPIENT_VIEW)}
               aria-label={lang === 'tr' ? 'Kartı tam ekran görüntüle' : 'View card fullscreen'}
             >
                <div className="transform scale-[0.6] origin-top-left w-[166%] h-[166%]">
                   <RecipientCard data={formData} previewMode={false} />
                </div>
             </div>

             {/* Share Buttons */}
             <div className="w-full space-y-2">
               <div className="flex gap-2">
                  <button
                    onClick={handleWhatsappShare}
                    className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-none hover:bg-[#1ebc57] active:scale-95 transition"
                    aria-label={lang === 'tr' ? 'WhatsApp ile paylaş' : 'Share via WhatsApp'}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setStep(AppStep.RECIPIENT_VIEW)}
                    className="flex-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 transition"
                    aria-label={lang === 'tr' ? 'Kartı aç' : 'Open card'}
                  >
                    <Share2 className="w-5 h-5" />
                    {t.openCard}
                  </button>
               </div>

               {/* Copy Link Button */}
               <button
                 onClick={handleCopyLink}
                 className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                   copied
                     ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                     : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
                 } active:scale-95`}
                 aria-label={copied ? (lang === 'tr' ? 'Kopyalandı' : 'Copied') : (lang === 'tr' ? 'Linki kopyala' : 'Copy link')}
               >
                 {copied ? (
                   <>
                     <Check className="w-5 h-5" />
                     {lang === 'tr' ? 'Kopyalandı!' : 'Copied!'}
                   </>
                 ) : (
                   <>
                     <Copy className="w-5 h-5" />
                     {t.copyLink}
                   </>
                 )}
               </button>
             </div>

             <button
               onClick={() => setStep(AppStep.LANDING)}
               className="mt-4 text-gray-400 hover:text-rose-500 text-xs font-medium transition flex items-center gap-1"
               aria-label={lang === 'tr' ? 'Ana sayfaya dön' : 'Back to home'}
             >
               <ArrowLeft className="w-3 h-3" />
               {t.backToHome}
             </button>
          </div>
        );
      
      case AppStep.RECIPIENT_VIEW:
        return (
           <div className="fixed inset-0 z-50 bg-rose-50 dark:bg-slate-950 overflow-y-auto">
             <RecipientCard data={formData} />
             <button 
                onClick={() => setStep(AppStep.PREVIEW)}
                className="fixed top-6 right-6 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition z-50"
             >
                <X className="w-6 h-6" />
             </button>
           </div>
        );

      default:
        return null;
    }
  };

  // --- MAIN APP LAYOUT ---
  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-500 ${step === AppStep.RECIPIENT_VIEW ? 'bg-black' : 'bg-rose-100 dark:bg-slate-950'}`}>
      
      {step !== AppStep.RECIPIENT_VIEW && <BackgroundPattern />}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}

      {/* PHONE FRAME CONTAINER 
          On Mobile: Full screen (h-full w-full)
          On Desktop: Fixed width/height, rounded borders, shadow
      */}
      <div 
        className={`
          relative w-full h-[100dvh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
          transition-all duration-500 overflow-hidden flex flex-col shadow-2xl
          md:w-[400px] md:h-[800px] md:rounded-[3rem] md:border-[8px] md:border-gray-900/10 dark:md:border-slate-800
        `}
      >
        {/* Only show header/footer if we are NOT in Recipient View */}
        {step !== AppStep.RECIPIENT_VIEW && (
          <>
            {renderHeader()}
            
            {/* Scrollable Content Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar"
            >
              {renderStepContent()}
            </div>

            {/* Sticky Footer for Steps 1-3 */}
            {step > 0 && step < 4 && renderFooter()}
          </>
        )}

        {/* Recipient View takes over entire container */}
        {step === AppStep.RECIPIENT_VIEW && renderStepContent()}
      </div>
    </div>
  );
}
