import { ScrollView, Text, View, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio);
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto);
  const [saving, setSaving] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handlePickProfilePhoto = async () => {
    try {
      setLoadingPhoto(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita acceso a la galería");
        setLoadingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validar formato
        const validFormats = ["image/jpeg", "image/png", "image/webp"];
        const mimeType = asset.mimeType || "unknown";
        
        if (!validFormats.includes(mimeType)) {
          Alert.alert("Formato no soportado", "Por favor usa JPG, PNG o WebP");
          setLoadingPhoto(false);
          return;
        }

        // Validar tamaño
        if (asset.fileSize && asset.fileSize > 50 * 1024 * 1024) {
          Alert.alert("Archivo muy grande", "La foto no debe exceder 50MB");
          setLoadingPhoto(false);
          return;
        }

        setProfilePhoto(asset.uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Éxito", "Foto de perfil seleccionada");
      }
    } catch (error) {
      console.error("Error picking profile photo:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo seleccionar la foto. Intenta de nuevo.");
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handlePickCoverPhoto = async () => {
    try {
      setLoadingPhoto(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita acceso a la galería");
        setLoadingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validar formato
        const validFormats = ["image/jpeg", "image/png", "image/webp"];
        const mimeType = asset.mimeType || "unknown";
        
        if (!validFormats.includes(mimeType)) {
          Alert.alert("Formato no soportado", "Por favor usa JPG, PNG o WebP");
          setLoadingPhoto(false);
          return;
        }

        // Validar tamaño
        if (asset.fileSize && asset.fileSize > 50 * 1024 * 1024) {
          Alert.alert("Archivo muy grande", "La portada no debe exceder 50MB");
          setLoadingPhoto(false);
          return;
        }

        setCoverPhoto(asset.uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Éxito", "Foto de portada seleccionada");
      }
    } catch (error) {
      console.error("Error picking cover photo:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo seleccionar la portada. Intenta de nuevo.");
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!name || !age || !city || !bio) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (parseInt(age) < 18 || parseInt(age) > 120) {
      Alert.alert("Error", "Por favor ingresa una edad válida");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateProfile({
        name,
        age: parseInt(age),
        city,
        bio,
        profilePhoto: profilePhoto || null,
        coverPhoto: coverPhoto || null,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo guardar los cambios. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Editar Perfil</Text>
          <Pressable onPress={() => router.back()} disabled={saving || loadingPhoto} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Cover Photo Section */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-sm font-semibold text-muted uppercase">Foto de Portada</Text>
          <View className="gap-4">
            <View className="w-full h-32 rounded-lg bg-gradient-to-br from-primary to-accent overflow-hidden border-2 border-border">
              {coverPhoto ? (
                <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-4xl">🖼️</Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={handlePickCoverPhoto}
              disabled={saving || loadingPhoto}
              className="px-6 py-3 bg-primary rounded-full items-center flex-row justify-center gap-2"
              style={({ pressed }) => [{ opacity: pressed && !saving && !loadingPhoto ? 0.8 : 1 }]}
            >
              {loadingPhoto ? (
                <>
                  <ActivityIndicator color="white" />
                  <Text className="text-white font-semibold text-sm">Cargando...</Text>
                </>
              ) : (
                <Text className="text-white font-semibold text-sm">Cambiar Portada</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Profile Photo Section */}
        <View className="px-4 py-6 gap-4 border-t border-border">
          <Text className="text-sm font-semibold text-muted uppercase">Foto de Perfil</Text>
          <View className="items-center gap-4">
            <View className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center overflow-hidden border-4 border-white">
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Text className="text-5xl">👤</Text>
              )}
            </View>
            <Pressable
              onPress={handlePickProfilePhoto}
              disabled={saving || loadingPhoto}
              className="px-6 py-2 bg-primary rounded-full flex-row items-center justify-center gap-2"
              style={({ pressed }) => [{ opacity: pressed && !saving && !loadingPhoto ? 0.8 : 1 }]}
            >
              {loadingPhoto ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold text-sm">Cargando...</Text>
                </>
              ) : (
                <Text className="text-white font-semibold text-sm">Cambiar Foto</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-4 py-6 gap-4 border-t border-border">
          {/* Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la modelo"
              placeholderTextColor="#9CA3AF"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving && !loadingPhoto}
            />
          </View>

          {/* Age */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Edad</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Edad"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving && !loadingPhoto}
            />
          </View>

          {/* City */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Ciudad</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ciudad, País"
              placeholderTextColor="#9CA3AF"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving && !loadingPhoto}
            />
          </View>

          {/* Bio */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Descripción</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving && !loadingPhoto}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 py-6 gap-3">
          <Pressable
            onPress={handleSave}
            disabled={saving || loadingPhoto}
            className="w-full rounded-full py-4 overflow-hidden flex-row items-center justify-center gap-2"
            style={({ pressed }) => [
              {
                backgroundColor: pressed && !saving && !loadingPhoto ? "#8B4BA8" : "#9B59B6",
                opacity: saving || loadingPhoto ? 0.7 : 1,
              },
            ]}
          >
            {saving ? (
              <>
                <ActivityIndicator color="white" />
                <Text className="text-center text-white font-bold text-lg">Guardando...</Text>
              </>
            ) : (
              <Text className="text-center text-white font-bold text-lg">Guardar Cambios</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            disabled={saving || loadingPhoto}
            className="w-full rounded-full py-3 border-2 border-primary"
            style={({ pressed }) => [{ opacity: pressed && !saving && !loadingPhoto ? 0.8 : 1 }]}
          >
            <Text className="text-center text-primary font-semibold text-lg">Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
