import { ScrollView, Text, View, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useApp();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto);
  const [saving, setSaving] = useState(false);

  // Sincronizar estado local con datos de la nube cuando carguen
  useEffect(() => {
    if (!loading && profile.name !== "Cargando...") {
      setName(profile.name);
      setAge(profile.age.toString());
      setCity(profile.city);
      setBio(profile.bio || "");
      setProfilePhoto(profile.profilePhoto);
      setCoverPhoto(profile.coverPhoto);
    }
  }, [loading, profile]);

  const getBase64 = async (uri: string) => {
    if (uri.startsWith("data:")) return uri;
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return `data:image/jpeg;base64,${base64}`;
  };

  const handlePickPhoto = async (type: "profile" | "cover") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [16, 9],
      quality: 0.6,
    });

    if (!result.canceled) {
      const base64 = await getBase64(result.assets[0].uri);
      if (type === "profile") setProfilePhoto(base64);
      else setCoverPhoto(base64);
    }
  };

  const handleSave = async () => {
    if (saving) return;
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
      Alert.alert("Éxito", "Cambios guardados globalmente");
      router.back();
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con Railway");
    } finally {
      setSaving(false);
    }
  };

  if (loading && name === "Cargando...") {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#9B59B6" />
        <Text className="mt-4 text-muted">Obteniendo datos de la nube...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
          <Text className="text-xl font-bold">Editar Perfil Real</Text>
          <Pressable onPress={() => router.back()}><Text className="text-2xl">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          <View>
            <Text className="text-xs font-bold text-muted mb-2">FOTO DE PORTADA</Text>
            <Pressable onPress={() => handlePickPhoto("cover")} className="w-full h-40 bg-surface rounded-xl overflow-hidden border border-border items-center justify-center">
              {coverPhoto ? <Image source={{ uri: coverPhoto }} className="w-full h-full" /> : <Text>+</Text>}
            </Pressable>
          </View>

          <View className="items-center">
            <Text className="text-xs font-bold text-muted mb-2">FOTO DE PERFIL</Text>
            <Pressable onPress={() => handlePickPhoto("profile")} className="w-32 h-32 rounded-full bg-surface border-4 border-white shadow-sm overflow-hidden items-center justify-center">
              {profilePhoto ? <Image source={{ uri: profilePhoto }} className="w-full h-full" /> : <Text>+</Text>}
            </Pressable>
          </View>

          <View className="gap-4">
            <TextInput value={name} onChangeText={setName} placeholder="Nombre" className="bg-white p-4 rounded-xl border border-border" />
            <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" className="bg-white p-4 rounded-xl border border-border" />
            <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" className="bg-white p-4 rounded-xl border border-border" />
            <TextInput value={bio} onChangeText={setBio} multiline placeholder="Bio" className="bg-white p-4 rounded-xl border border-border h-32" />
          </View>

          <Pressable onPress={handleSave} disabled={saving} className="bg-primary p-4 rounded-full items-center shadow-md">
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Guardar Cambios Globales</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
