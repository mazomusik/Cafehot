import { useCallback } from "react";
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
  const deviceId = Device.osInternalBuildId || "dev-id";

  const { data: profile, isLoading: loadingProfile } = trpc.model.getProfile.useQuery(undefined, {
    refetchInterval: 5000, // Cada 5 segundos para que sea "tiempo real"
  });

  const { data: gallery, isLoading: loadingGallery } = trpc.gallery.getGallery.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const { data: isSubscribed } = trpc.subscription.checkSubscription.useQuery({ deviceId });

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

  // VALORES DE RESPALDO (Para que la app nunca se vea vacía)
  const defaultProfile: ModelProfile = {
    name: "Cargando...",
    age: 24,
    city: "Colombia",
    bio: "",
    profilePhoto: null,
    coverPhoto: null,
    subscriptionPrice: 8000,
    subscribers: 8352,
    whatsappNumber: "+57",
    breKey: "",
    isLive: false,
    lastLiveTime: null,
  };

  return {
    profile: profile || defaultProfile,
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
