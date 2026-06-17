import { create } from 'zustand';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';

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
  signInWithEmail: (email: string, password: string) => Promise<void>;
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
        // Assign 'admin' role if the email matches the predefined admin address
        const role = firebaseUser.email === "admin@ashaafoundation.com" ? "admin" : "user";
        
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role,
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isAuthLoading: false,
        });

        // Sync to MongoDB via API Route
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProfile),
        }).catch(err => console.error("Failed to sync user to DB", err));
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

  signInWithEmail: async (email, password) => {
    try {
      set({ isAuthLoading: true });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email Sign-In Error:", error);
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
