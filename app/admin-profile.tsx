import { ScrollView, Text, View, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto);
  const [saving, setSaving] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  // Función para convertir imagen a Base64 para subir a la nube
  const getBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
      console.error(e);
      return uri;
    }
  };

  const handlePickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = await getBase64(result.assets[0].uri);
      setProfilePhoto(base64);
    }
  };

  const handlePickCoverPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = await getBase64(result.assets[0].uri);
      setCoverPhoto(base64);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name,
        age: parseInt(age),
        city,
        bio,
        profilePhoto,
        coverPhoto,
      });
      Alert.alert("Éxito", "Perfil actualizado en la nube");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo sincronizar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Editar Perfil Global</Text>
          <Pressable onPress={() => router.back()} disabled={saving}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        <View className="px-4 py-6 gap-4">
          <Text className="text-sm font-semibold text-muted uppercase">Foto de Portada</Text>
          <Pressable onPress={handlePickCoverPhoto} className="w-full h-32 rounded-lg bg-surface border-2 border-dashed border-border overflow-hidden items-center justify-center">
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-muted">Toca para subir portada</Text>
            )}
          </Pressable>
        </View>

        <View className="px-4 py-6 gap-4 border-t border-border items-center">
          <Text className="text-sm font-semibold text-muted uppercase">Foto de Perfil</Text>
          <Pressable onPress={handlePickProfilePhoto} className="w-32 h-32 rounded-full bg-surface border-2 border-dashed border-border overflow-hidden items-center justify-center">
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-muted text-center">Toca para foto</Text>
            )}
          </Pressable>
        </View>

        <View className="px-4 py-6 gap-4 border-t border-border">
          <TextInput value={name} onChangeText={setName} placeholder="Nombre" className="bg-surface p-4 rounded-lg text-foreground border border-border" />
          <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" className="bg-surface p-4 rounded-lg text-foreground border border-border" />
          <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" className="bg-surface p-4 rounded-lg text-foreground border border-border" />
          <TextInput value={bio} onChangeText={setBio} multiline numberOfLines={4} placeholder="Biografía" className="bg-surface p-4 rounded-lg text-foreground border border-border" />
        </View>

        <View className="px-4 py-6">
          <Pressable onPress={handleSave} disabled={saving} className="w-full bg-primary py-4 rounded-full items-center">
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Guardar en la Nube</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
