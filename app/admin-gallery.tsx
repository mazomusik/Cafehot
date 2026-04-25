import { ScrollView, Text, View, Pressable, Alert, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AdminGalleryScreen() {
  const router = useRouter();
  const { gallery, deleteGalleryItem, addGalleryItem } = useApp();
  const [loading, setLoading] = useState(false);

  const getBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
      return uri;
    }
  };

  const handlePickAndUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
      });

      if (!result.canceled) {
        setLoading(true);
        const base64 = await getBase64(result.assets[0].uri);

        await addGalleryItem({
          id: Date.now().toString(),
          uri: base64,
          type: "photo",
          isPrivate: true,
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Éxito", "Foto subida a la nube correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border bg-white">
        <Text className="text-xl font-bold text-foreground">Gestionar Galería</Text>
        <Pressable onPress={() => router.back()} disabled={loading}>
          <Text className="text-2xl text-foreground font-bold">✕</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <Pressable
          onPress={handlePickAndUpload}
          disabled={loading}
          className="w-full bg-primary py-4 rounded-xl items-center mb-6 shadow-sm"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">+ Subir Nueva Foto</Text>
          )}
        </Pressable>

        <Text className="text-lg font-bold text-foreground mb-4">Tus fotos en la nube</Text>

        <View className="flex-row flex-wrap justify-between">
          {gallery.map((item) => (
            <View key={item.id} className="w-[48%] mb-4 bg-white rounded-xl overflow-hidden border border-border shadow-sm">
              <Image source={{ uri: item.uri }} className="w-full h-40" resizeMode="cover" />
              <View className="p-2 flex-row justify-between items-center">
                <Text className="text-[10px] text-muted">{item.isPrivate ? "🔒 Privado" : "🔓 Público"}</Text>
                <Pressable
                  onPress={() => deleteGalleryItem(item.id)}
                  className="bg-red-100 p-2 rounded-full"
                >
                  <Text className="text-red-600 text-[10px] font-bold">Borrar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {gallery.length === 0 && (
          <View className="items-center py-20">
            <Text className="text-muted">No hay fotos todavía</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
