import { ScrollView, Text, View, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as ImagePicker from "expo-image-picker";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useApp();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (profile && !initialized && profile.name !== "Cargando...") {
      setName(profile.name || "");
      setAge(profile.age?.toString() || "");
      setCity(profile.city || "");
      setBio(profile.bio || "");
      setProfilePhoto(profile.profilePhoto);
      setCoverPhoto(profile.coverPhoto);
      setInitialized(true);
    }
  }, [profile, initialized]);

  const handlePickPhoto = async (type: "profile" | "cover") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [16, 9],
      quality: 0.5,
      base64: true, // Usamos la opción nativa de Expo que es más estable
    });

    if (!result.canceled && result.assets[0]) {
      const img = result.assets[0];
      // Guardamos el string base64 directo de la cámara (sin FileSystem externo)
      const formattedBase64 = `data:image/jpeg;base64,${img.base64}`;
      if (type === "profile") setProfilePhoto(formattedBase64);
      else setCoverPhoto(formattedBase64);
    }
  };

  const handleSave = async () => {
    if (!name) { Alert.alert("Error", "El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      await updateProfile({
        name,
        age: parseInt(age) || 0,
        city,
        bio,
        profilePhoto: profilePhoto?.startsWith("data:") ? profilePhoto : undefined,
        coverPhoto: coverPhoto?.startsWith("data:") ? coverPhoto : undefined,
      });

      Alert.alert("¡Éxito!", "Cambios guardados en la nube correctamente.");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar. Intenta con una foto distinta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-white">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-white shadow-sm">
          <Text className="text-xl font-bold text-gray-800">Panel de Edición</Text>
          <Pressable onPress={() => router.back()} disabled={saving}><Text className="text-2xl">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          <View>
            <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Foto de Portada</Text>
            <Pressable onPress={() => handlePickPhoto("cover")} className="w-full h-48 bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 items-center justify-center">
              {coverPhoto ? <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-300">Seleccionar Portada</Text>}
            </Pressable>
          </View>

          <View className="items-center -mt-12">
            <Pressable onPress={() => handlePickPhoto("profile")} className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-2xl overflow-hidden items-center justify-center">
              {profilePhoto ? <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-300">Foto</Text>}
            </Pressable>
            <Text className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Foto de Perfil</Text>
          </View>

          <View className="gap-4">
            <TextInput value={name} onChangeText={setName} placeholder="Nombre Artístico" className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-bold" />
            <View className="flex-row gap-4">
              <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" className="flex-1 bg-gray-50 p-5 rounded-3xl border border-gray-100" />
              <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" className="flex-2 bg-gray-50 p-5 rounded-3xl border border-gray-100" />
            </View>
            <TextInput value={bio} onChangeText={setBio} multiline placeholder="Cuéntanos sobre ti..." className="bg-gray-50 p-5 rounded-3xl border border-gray-100 h-32 text-gray-800" textAlignVertical="top" />
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`p-6 rounded-full items-center shadow-xl ${saving ? 'bg-gray-300' : 'bg-purple-600'}`}
          >
            {saving ? (
              <View className="flex-row items-center gap-3">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-lg">Guardando...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-xl">🚀 GUARDAR EN LA NUBE</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
