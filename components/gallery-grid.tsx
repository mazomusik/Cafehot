import { FlatList, Image, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/hooks/use-app-state";
import { useState, useRef, useEffect } from "react";

interface GalleryGridProps {
  items: GalleryItem[];
  isSubscribed: boolean;
  onItemPress?: (item: GalleryItem) => void;
  freeItemsCount?: number;
}

export function GalleryGrid({
  items,
  isSubscribed,
  onItemPress,
  freeItemsCount = 4,
}: GalleryGridProps) {
  const renderItem = ({ item, index }: { item: GalleryItem; index: number }) => {
    const isFree = !item.isPrivate || isSubscribed || index < freeItemsCount;
    const isPrivateVideo = item.type === "video" && item.isPrivate && !isFree;

    return (
      <Pressable
        onPress={() => onItemPress?.(item)}
        className="flex-1 aspect-square m-1 rounded-lg overflow-hidden bg-surface"
      >
        {/* Mostrar imagen de preview para todos */}
        <Image
          source={{ uri: item.uri }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Overlay de blur para contenido privado */}
        {!isFree && (
          <BlurView intensity={90} className="absolute inset-0 flex items-center justify-center bg-black/20">
            <View className="items-center gap-2">
              <Text className="text-gray-300 text-center font-semibold text-sm px-4">
                Desbloquea todo mi contenido privado
              </Text>
              <Text className="text-gray-400 text-xs">Suscríbete para ver más</Text>
            </View>
          </BlurView>
        )}

        {/* Badge de VIDEO */}
        {item.type === "video" && (
          <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded">
            <Text className="text-white text-xs font-semibold">▶ VIDEO</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={{ paddingHorizontal: 4 }}
    />
  );
}
