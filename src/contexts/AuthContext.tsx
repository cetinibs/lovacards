import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

interface UserData {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  cardsCreated: number;
  createdAt: Date;
  premiumUntil: Date | null;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  incrementCardCount: () => Promise<void>;
  canCreateCard: () => boolean;
  remainingFreeCards: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FREE_CARDS_LIMIT = 1;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [localCardsCreated, setLocalCardsCreated] = useState(0);

  // Load local card count for non-authenticated users
  useEffect(() => {
    const storedCount = localStorage.getItem('loveCardUsage');
    if (storedCount) {
      setLocalCardsCreated(parseInt(storedCount, 10));
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch or create user document
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          // Create new user document
          const newUserData: UserData = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isPremium: false,
            cardsCreated: localCardsCreated, // Transfer local count
            createdAt: new Date(),
            premiumUntil: null
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);

          // Clear local storage after transferring
          localStorage.removeItem('loveCardUsage');
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [localCardsCreated]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const incrementCardCount = async () => {
    if (user && userData) {
      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        cardsCreated: increment(1)
      });
      setUserData(prev => prev ? { ...prev, cardsCreated: prev.cardsCreated + 1 } : null);
    } else {
      // Update local storage
      const newCount = localCardsCreated + 1;
      setLocalCardsCreated(newCount);
      localStorage.setItem('loveCardUsage', newCount.toString());
    }
  };

  const canCreateCard = (): boolean => {
    // Premium users can always create
    if (userData?.isPremium) {
      return true;
    }

    // Check card count
    const cardsCreated = user ? (userData?.cardsCreated || 0) : localCardsCreated;
    return cardsCreated < FREE_CARDS_LIMIT;
  };

  const remainingFreeCards = (() => {
    if (userData?.isPremium) return Infinity;
    const cardsCreated = user ? (userData?.cardsCreated || 0) : localCardsCreated;
    return Math.max(0, FREE_CARDS_LIMIT - cardsCreated);
  })();

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signOut,
    incrementCardCount,
    canCreateCard,
    remainingFreeCards
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
