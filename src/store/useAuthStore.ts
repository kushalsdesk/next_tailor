import { create } from 'zustand';

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
  logout: () => void;
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

  logout: () => 
    set({ 
      user: null, 
      isAuthenticated: false 
    }),
}));
