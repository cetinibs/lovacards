import React, { useState } from 'react';
import { Sparkles, X, Mail, CreditCard, Check, Loader2, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

interface ProModalProps {
  onClose: () => void;
  lang: 'en' | 'tr';
}

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || '';

export const ProModal: React.FC<ProModalProps> = ({ onClose, lang }) => {
  const { user, userData, signInWithGoogle, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    en: {
      title: 'LoveCard Premium',
      freeUsed: 'You have used your free card.',
      loginFirst: 'Sign in with Google to continue',
      upgradeDesc: 'Upgrade to Pro for unlimited cards, exclusive designs, and advanced AI poems.',
      signInGoogle: 'Sign in with Google',
      upgradePro: 'Upgrade to Pro',
      price: '$2.99/month',
      noThanks: 'NO, THANKS',
      features: [
        'Unlimited cards',
        'Premium flower designs',
        'Advanced AI poems',
        'Priority support'
      ],
      signedInAs: 'Signed in as',
      signOut: 'Sign out',
      processing: 'Processing...',
      errorPayment: 'Payment failed. Please try again.',
      alreadyPremium: 'You are already a Premium member!',
      premiumActive: 'Premium Active'
    },
    tr: {
      title: 'LoveCard Premium',
      freeUsed: 'Ucretsiz kartinizi kullandiniz.',
      loginFirst: 'Devam etmek icin Google ile giris yapin',
      upgradeDesc: 'Sinirsiz kart, ozel tasarimlar ve gelismis AI siirleri icin Pro\'ya yukseltin.',
      signInGoogle: 'Google ile Giris Yap',
      upgradePro: 'Pro\'ya Yukselt',
      price: '₺99/ay',
      noThanks: 'HAYIR, TESEKKURLER',
      features: [
        'Sinirsiz kart',
        'Premium cicek tasarimlari',
        'Gelismis AI siirleri',
        'Oncelikli destek'
      ],
      signedInAs: 'Giris yapildi',
      signOut: 'Cikis yap',
      processing: 'Isleniyor...',
      errorPayment: 'Odeme basarisiz. Lutfen tekrar deneyin.',
      alreadyPremium: 'Zaten Premium uyesiniz!',
      premiumActive: 'Premium Aktif'
    }
  };

  const text = t[lang];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(lang === 'tr' ? 'Giris basarisiz' : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll just show a message
      // In production, you would redirect to Stripe Checkout
      if (STRIPE_PUBLIC_KEY && PRICE_ID) {
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        if (!stripe) throw new Error('Stripe failed to load');

        // In production, create a checkout session on your backend
        // For now, we'll show a demo message
        alert(lang === 'tr'
          ? 'Stripe odeme entegrasyonu icin backend gereklidir. Demo modunda calisiyor.'
          : 'Stripe payment requires backend integration. Running in demo mode.'
        );
      } else {
        alert(lang === 'tr'
          ? 'Stripe yapilandirilmamis. Environment variable\'lari kontrol edin.'
          : 'Stripe not configured. Please check environment variables.'
        );
      }
    } catch (err) {
      setError(text.errorPayment);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // If user is already premium
  if (userData?.isPremium) {
    return (
      <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden border border-white/20 dark:border-slate-800">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="text-amber-500 w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full mb-4">
            <Check className="w-4 h-4" />
            <span className="text-sm font-bold">{text.premiumActive}</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">{text.alreadyPremium}</h3>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mt-6"
          >
            {lang === 'tr' ? 'Kart Olusturmaya Devam Et' : 'Continue Creating Cards'}
          </button>
        </div>
      </div>
    );
  }

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

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">{text.title}</h3>

        {!user ? (
          // Step 1: Sign in with Google
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
              {text.freeUsed}
            </p>
            <p className="text-gray-500 dark:text-gray-500 mb-6 text-xs">
              {text.loginFirst}
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-800 text-gray-700 dark:text-white font-bold py-4 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-slate-600 transition-all mb-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {text.signInGoogle}
                </>
              )}
            </button>
          </>
        ) : (
          // Step 2: Upgrade to Premium
          <>
            {/* User info */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
              )}
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.signedInAs}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
                title={text.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              {text.upgradeDesc}
            </p>

            {/* Features */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
              {text.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mb-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {text.processing}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {text.upgradePro} - {text.price}
                </>
              )}
            </button>
          </>
        )}

        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 text-xs hover:text-gray-600 dark:hover:text-gray-300 font-medium tracking-wide">
          {text.noThanks}
        </button>
      </div>
    </div>
  );
};
