import { create } from 'zustand';

interface DataState {
  // Gallery Images fetched from Firebase Storage/Firestore
  galleryImages: string[];
  isGalleryLoading: boolean;
  
  // Future-proofing for dynamic courses from DB
  // courses: Course[];
  // isCoursesLoading: boolean;

  // Actions
  setGalleryImages: (images: string[]) => void;
  setGalleryLoading: (isLoading: boolean) => void;
}

export const useDataStore = create<DataState>((set) => ({
  // Initialize with the static fallback images until DB is hooked up
  galleryImages: ["/sample.jpeg", "/images/image1.jpeg", "/images/image2.jpeg"],
  isGalleryLoading: false,

  setGalleryImages: (images) => set({ galleryImages: images }),
  setGalleryLoading: (isLoading) => set({ isGalleryLoading: isLoading }),
}));
