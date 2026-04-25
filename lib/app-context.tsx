import React, { createContext, useContext } from "react";
import { useAppState, type ModelProfile, type GalleryItem } from "@/hooks/use-app-state";

interface AppContextType {
  profile: ModelProfile;
  gallery: GalleryItem[];
  loading: boolean;
  updateProfile: (updates: Partial<ModelProfile>) => Promise<void>;
  addGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  incrementSubscribers: () => Promise<void>;
  updateSubscribers: (newCount: number) => Promise<void>;
  subscribe: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appState = useAppState();

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
