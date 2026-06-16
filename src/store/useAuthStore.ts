import { create } from 'zustand';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  
  // Real Firebase Actions
  initializeAuthListener: () => () => void; // Returns unsubscribe function
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true, // Starts true until Firebase initializes

  setUser: (user) => 
    set({ 
      user, 
      isAuthenticated: !!user, 
      isAuthLoading: false 
    }),

  setAuthLoading: (isLoading) => 
    set({ isAuthLoading: isLoading }),

  initializeAuthListener: () => {
    // Listen for Firebase Auth state changes globally
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Here we could also fetch a user document from Firestore to get their role
        // For now, everyone is a 'user' unless their email matches an admin email
        const role = firebaseUser.email === "ashaafoundation25@gmail.com" ? "admin" : "user";
        
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role,
          },
          isAuthenticated: true,
          isAuthLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isAuthLoading: false });
      }
    });
    return unsubscribe;
  },

  signInWithGoogle: async () => {
    try {
      set({ isAuthLoading: true });
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle the UI update automatically
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      set({ isAuthLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      // Listener handles clearing state automatically
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  },
}));
