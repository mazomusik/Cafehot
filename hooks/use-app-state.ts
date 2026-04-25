import { useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import * as Device from "expo-device";

export interface ModelProfile {
  name: string;
  age: number;
  city: string;
  bio: string | null;
  profilePhoto: string | null;
  coverPhoto: string | null;
  subscriptionPrice: number;
  subscribers: number;
  whatsappNumber: string;
  breKey: string;
  isLive: boolean;
  lastLiveTime: string | null;
}

export interface GalleryItem {
  id: string;
  uri: string;
  type: "photo" | "video";
  isPrivate: boolean;
}

export function useAppState() {
  const utils = trpc.useUtils();
  const deviceId = Device.osInternalBuildId || "default-device-id";

  // 1. Obtener datos del servidor con React Query (Sync automático)
  const { data: profile, isLoading: loadingProfile } = trpc.model.getProfile.useQuery(undefined, {
    refetchInterval: 10000, // Refrescar cada 10 segundos para "tiempo real" básico
  });

  const { data: gallery, isLoading: loadingGallery } = trpc.gallery.getGallery.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: isSubscribed } = trpc.subscription.checkSubscription.useQuery({ deviceId });

  // 2. Mutaciones para actualizar datos en la base de datos
  const updateProfileMutation = trpc.model.updateProfile.useMutation({
    onSuccess: () => utils.model.getProfile.invalidate(),
  });

  const updateSubscribersMutation = trpc.model.updateSubscribers.useMutation({
    onSuccess: () => utils.model.getProfile.invalidate(),
  });

  const addGalleryMutation = trpc.gallery.addItem.useMutation({
    onSuccess: () => utils.gallery.getGallery.invalidate(),
  });

  const deleteGalleryMutation = trpc.gallery.deleteItem.useMutation({
    onSuccess: () => utils.gallery.getGallery.invalidate(),
  });

  const subscribeMutation = trpc.subscription.subscribe.useMutation({
    onSuccess: () => {
      utils.subscription.checkSubscription.invalidate();
      utils.model.getProfile.invalidate();
    },
  });

  // 3. Wrappers para mantener la compatibilidad con el resto de la app
  const updateProfile = useCallback(async (updates: Partial<ModelProfile>) => {
    await updateProfileMutation.mutateAsync(updates as any);
  }, [updateProfileMutation]);

  const updateSubscribers = useCallback(async (newCount: number) => {
    await updateSubscribersMutation.mutateAsync({ count: newCount });
  }, [updateSubscribersMutation]);

  const addGalleryItem = useCallback(async (item: GalleryItem) => {
    await addGalleryMutation.mutateAsync(item);
  }, [addGalleryMutation]);

  const deleteGalleryItem = useCallback(async (id: string) => {
    await deleteGalleryMutation.mutateAsync({ id });
  }, [deleteGalleryMutation]);

  const subscribe = useCallback(async () => {
    await subscribeMutation.mutateAsync({ deviceId });
  }, [subscribeMutation, deviceId]);

  return {
    profile: profile || {
      name: "Cargando...",
      age: 0,
      city: "",
      bio: "",
      profilePhoto: null,
      coverPhoto: null,
      subscriptionPrice: 0,
      subscribers: 0,
      whatsappNumber: "",
      breKey: "",
      isLive: false,
      lastLiveTime: null,
    },
    gallery: gallery || [],
    isSubscribed: !!isSubscribed,
    loading: loadingProfile || loadingGallery,
    updateProfile,
    updateSubscribers,
    addGalleryItem,
    deleteGalleryItem,
    subscribe,
  };
}
