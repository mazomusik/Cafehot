import { ScrollView, Text, View, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();

  // Estados locales: Estos NO cambian hasta que tú lo digas
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cargamos los datos de la nube SOLO UNA VEZ al abrir la pantalla
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

  const getBase64 = async (uri: string | null) => {
    if (!uri || uri.startsWith("http") || uri.startsWith("data:")) return uri;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
      console.log("Error Base64:", e);
      return uri;
    }
  };

  const handlePickPhoto = async (type: "profile" | "cover") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 0.2, // COMPRESIÓN EXTREMA PARA QUE NO FALLE EL INTERNET
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        console.log("Foto elegida:", selectedUri);
        if (type === "profile") setProfilePhoto(selectedUri);
        else setCoverPhoto(selectedUri);
      }
    } catch (e) {
      Alert.alert("Error", "Permisos de galería denegados o error al abrir.");
    }
  };

  const handleSave = async () => {
    if (!name) { Alert.alert("Error", "El nombre no puede estar vacío"); return; }
    setSaving(true);
    try {
      // Convertimos a base64 justo antes de enviar
      const finalProfile = await getBase64(profilePhoto);
      const finalCover = await getBase64(coverPhoto);

      await updateProfile({
        name,
        age: parseInt(age) || 0,
        city,
        bio,
        profilePhoto: finalProfile,
        coverPhoto: finalCover,
      });

      Alert.alert("Éxito", "Cambios guardados en la nube");
      router.back();
    } catch (error) {
      Alert.alert("Fallo al subir", "La foto es muy pesada o el internet es inestable. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-white">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center bg-white">
          <Text className="text-xl font-bold text-black">Editar Perfil</Text>
          <Pressable onPress={() => router.back()} disabled={saving}><Text className="text-2xl text-black">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          {/* Portada */}
          <View>
            <Text className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Foto de Portada</Text>
            <Pressable onPress={() => handlePickPhoto("cover")} className="w-full h-44 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 items-center justify-center">
              {coverPhoto ? <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-400">Toca para elegir</Text>}
            </Pressable>
          </View>

          {/* Perfil */}
          <View className="items-center -mt-16">
            <Pressable onPress={() => handlePickPhoto("profile")} className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden items-center justify-center">
              {profilePhoto ? <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-400">Foto</Text>}
            </Pressable>
            <Text className="text-[10px] font-bold text-gray-500 mt-2 uppercase">Foto de Perfil</Text>
          </View>

          {/* Formulario */}
          <View className="gap-4">
            <TextInput value={name} onChangeText={setName} placeholder="Nombre Artístico" className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-black" placeholderTextColor="#999" />
            <View className="flex-row gap-4">
              <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200 text-black" placeholderTextColor="#999" />
              <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" className="flex-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-black" placeholderTextColor="#999" />
            </View>
            <TextInput value={bio} onChangeText={setBio} multiline placeholder="Biografía..." className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-black h-24" textAlignVertical="top" placeholderTextColor="#999" />
          </View>

          <Pressable onPress={handleSave} disabled={saving} className={`p-5 rounded-full items-center shadow-lg ${saving ? 'bg-gray-400' : 'bg-purple-600'}`}>
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">💾 GUARDAR EN LA NUBE</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
