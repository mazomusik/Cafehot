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

  // Estados locales independientes para evitar sobreescritura por sincronización
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Inicializar estados con datos de la nube solo una vez
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
      // USAMOS "base64" DIRECTAMENTE PARA EVITAR EL ERROR DE UNDEFINED
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
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
        quality: 0.3, // Comprimimos para que no pese tanto en la red
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        if (type === "profile") setProfilePhoto(selectedUri);
        else setCoverPhoto(selectedUri);
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo abrir la galería de fotos.");
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert("Error", "El nombre artístico es necesario");
      return;
    }
    setSaving(true);
    try {
      // Procesar imágenes a base64 antes de enviar
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

      Alert.alert("Éxito", "Cambios sincronizados con la nube correctamente");
      router.back();
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error de Sincronización", "La subida falló. Esto puede ser por el tamaño de las fotos o inestabilidad en el servidor de Railway. Intenta de nuevo con fotos más ligeras.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-white">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-white">
          <Text className="text-xl font-bold text-gray-900">Editar Mi Perfil</Text>
          <Pressable onPress={() => router.back()} disabled={saving}><Text className="text-2xl text-gray-900">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          {/* Foto de Portada */}
          <View>
            <Text className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Foto de Portada</Text>
            <Pressable onPress={() => handlePickPhoto("cover")} className="w-full h-44 bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 items-center justify-center">
              {coverPhoto ? <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-400">Toca para seleccionar portada</Text>}
            </Pressable>
          </View>

          {/* Foto de Perfil */}
          <View className="items-center -mt-16">
            <Pressable onPress={() => handlePickPhoto("profile")} className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-2xl overflow-hidden items-center justify-center">
              {profilePhoto ? <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-gray-400">Foto</Text>}
            </Pressable>
            <Text className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Foto de Perfil</Text>
          </View>

          {/* Campos de Datos */}
          <View className="gap-4">
            <View>
              <Text className="text-[10px] font-bold text-purple-500 mb-1 ml-2">NOMBRE PÚBLICO</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Nombre" className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-900" />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-purple-500 mb-1 ml-2">EDAD</Text>
                <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-900" />
              </View>
              <View className="flex-2">
                <Text className="text-[10px] font-bold text-purple-500 mb-1 ml-2">CIUDAD</Text>
                <TextInput value={city} onChangeText={setCity} placeholder="Ciudad, País" className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-900" />
              </View>
            </View>

            <View>
              <Text className="text-[10px] font-bold text-purple-500 mb-1 ml-2">DESCRIPCIÓN / BIO</Text>
              <TextInput value={bio} onChangeText={setBio} multiline placeholder="Escribe tu biografía..." className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-900 h-28" textAlignVertical="top" />
            </View>
          </View>

          {/* BOTÓN DE GUARDADO GLOBAL */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`mt-4 p-5 rounded-full items-center shadow-xl ${saving ? 'bg-gray-400' : 'bg-purple-600'}`}
          >
            {saving ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-lg">Sincronizando...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">🚀 GUARDAR EN LA NUBE</Text>
            )}
          </Pressable>
          <Text className="text-center text-[10px] text-gray-400 italic">Esta acción actualizará tu perfil para todos los usuarios.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
