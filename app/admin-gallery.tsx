import { ScrollView, Text, View, Pressable, Alert, FlatList, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

export default function AdminGalleryScreen() {
  const router = useRouter();
  const { gallery, deleteGalleryItem, updateGalleryItem, addGalleryItem } = useApp();
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de que deseas eliminar este elemento?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await deleteGalleryItem(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        style: "destructive",
      },
    ]);
  };

  const handleTogglePrivate = async (id: string, isPrivate: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateGalleryItem(id, { isPrivate: !isPrivate });
  };

  const handlePickMultipleImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita acceso a la galería para subir archivos");
        return;
      }

      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      } as any);

      if (!result.canceled && result.assets.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        const validImageFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        const validVideoFormats = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
        const allValidFormats = [...validImageFormats, ...validVideoFormats];

        for (const asset of result.assets) {
          const mimeType = asset.mimeType || "unknown";

          if (!allValidFormats.includes(mimeType)) {
            errorCount++;
            continue;
          }

          const maxSize = 100 * 1024 * 1024;
          if (asset.fileSize && asset.fileSize > maxSize) {
            errorCount++;
            continue;
          }

          const newItem = {
            id: Date.now().toString() + Math.random(),
            uri: asset.uri,
            type: (validVideoFormats.includes(mimeType) ? "video" : "photo") as "video" | "photo",
            isPrivate: true,
          };

          await addGalleryItem(newItem);
          successCount++;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Subida completada",
          `${successCount} archivo(s) agregado(s)${errorCount > 0 ? ` (${errorCount} rechazado(s))` : ""}`
        );
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudieron seleccionar los archivos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row gap-4">
        <Image
          source={{ uri: item.uri }}
          className="w-20 h-20 rounded-lg bg-gray-300"
          resizeMode="cover"
        />
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-sm font-semibold text-foreground capitalize">{item.type}</Text>
            <Text className="text-xs text-muted mt-1">{item.isPrivate ? "Privado" : "Público"}</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleTogglePrivate(item.id, item.isPrivate)}
              className="flex-1 bg-primary/20 rounded-lg py-2 px-3"
            >
              <Text className="text-xs font-semibold text-primary text-center">
                {item.isPrivate ? "Hacer Público" : "Hacer Privado"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeleteItem(item.id)}
              className="flex-1 bg-error/20 rounded-lg py-2 px-3"
            >
              <Text className="text-xs font-semibold text-error text-center">Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Galería</Text>
          <Pressable onPress={() => router.back()} disabled={loading} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Add Button */}
        <View className="px-4 py-6">
          <Pressable
            onPress={handlePickMultipleImages}
            disabled={loading}
            className="w-full rounded-full py-4 overflow-hidden"
            style={({ pressed }) => [
              {
                backgroundColor: pressed && !loading ? "#8B4BA8" : "#9B59B6",
                opacity: loading ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-white font-bold text-lg">
              {loading ? "Cargando..." : "+ Agregar Fotos o Videos"}
            </Text>
          </Pressable>
          <Text className="text-center text-xs text-muted mt-2">Puedes seleccionar múltiples archivos a la vez</Text>
        </View>

        {/* Gallery List */}
        <View className="px-4">
          {gallery.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-muted text-sm">No hay fotos o videos en la galería</Text>
            </View>
          ) : (
            <FlatList
              data={gallery}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
