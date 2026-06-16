import { create } from 'zustand';

interface UIState {
  // Mobile Navigation
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;

  // Cross-component communications
  // Useful if clicking a button in Hero needs to pre-select a specific course
  targetCourseId: string | null;
  setTargetCourseId: (courseId: string | null) => void;

  // Global overlay loaders (e.g. during heavy DB mutations outside of local component scope)
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  targetCourseId: null,
  setTargetCourseId: (courseId) => set({ targetCourseId: courseId }),

  isGlobalLoading: false,
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
}));
