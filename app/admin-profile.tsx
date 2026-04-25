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

  // Estados locales: para que veas los cambios al instante sin internet
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age?.toString() || "");
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto);
  const [saving, setSaving] = useState(false);
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // Cargamos los datos de la nube una sola vez al entrar
  useEffect(() => {
    if (!loading && !isDataInitialized && profile.name !== "Cargando...") {
      setName(profile.name);
      setAge(profile.age.toString());
      setCity(profile.city);
      setBio(profile.bio || "");
      setProfilePhoto(profile.profilePhoto);
      setCoverPhoto(profile.coverPhoto);
      setIsDataInitialized(true);
    }
  }, [loading, profile]);

  const getBase64 = async (uri: string) => {
    if (!uri || uri.startsWith("data:") || uri.startsWith("http")) return uri;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
      console.error("Error convirtiendo a base64:", e);
      return uri;
    }
  };

  const handlePickPhoto = async (type: "profile" | "cover") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [16, 9],
      quality: 0.6,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      if (type === "profile") setProfilePhoto(localUri);
      else setCoverPhoto(localUri);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // PROCESO DE SUBIDA: Solo aquí usamos internet para mandar a Cloudinary
      const finalProfilePhoto = await getBase64(profilePhoto || "");
      const finalCoverPhoto = await getBase64(coverPhoto || "");

      await updateProfile({
        name,
        age: parseInt(age) || 0,
        city,
        bio,
        profilePhoto: finalProfilePhoto,
        coverPhoto: finalCoverPhoto,
      });

      Alert.alert("Éxito", "Todos los cambios se han guardado en la nube");
      router.back();
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con el servidor. Verifica tu internet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Encabezado sin bloqueos */}
        <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
          <Text className="text-xl font-bold text-foreground">Panel de Edición Local</Text>
          <Pressable onPress={() => router.back()} disabled={saving}><Text className="text-2xl">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          {/* Foto de Portada */}
          <View>
            <Text className="text-[10px] font-bold text-muted mb-2 uppercase">Foto de Portada</Text>
            <Pressable onPress={() => handlePickPhoto("cover")} className="w-full h-44 bg-surface rounded-2xl overflow-hidden border-2 border-dashed border-border items-center justify-center">
              {coverPhoto ? <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-muted">Elegir Portada</Text>}
            </Pressable>
          </View>

          {/* Foto de Perfil */}
          <View className="items-center -mt-16">
            <Pressable onPress={() => handlePickPhoto("profile")} className="w-32 h-32 rounded-full bg-surface border-4 border-white shadow-lg overflow-hidden items-center justify-center">
              {profilePhoto ? <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" /> : <Text className="text-muted">Foto</Text>}
            </Pressable>
            <Text className="text-[10px] font-bold text-muted mt-2 uppercase">Foto de Perfil</Text>
          </View>

          {/* Campos de texto */}
          <View className="gap-4">
            <View>
              <Text className="text-[10px] font-bold text-primary ml-2 mb-1 uppercase">Nombre Artístico</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Nombre" className="bg-surface p-4 rounded-2xl border border-border text-foreground" />
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-primary ml-2 mb-1 uppercase">Edad</Text>
                <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" className="bg-surface p-4 rounded-2xl border border-border text-foreground" />
              </View>
              <View className="flex-2">
                <Text className="text-[10px] font-bold text-primary ml-2 mb-1 uppercase">Ciudad</Text>
                <TextInput value={city} onChangeText={setCity} className="bg-surface p-4 rounded-2xl border border-border text-foreground" />
              </View>
            </View>
            <View>
              <Text className="text-[10px] font-bold text-primary ml-2 mb-1 uppercase">Biografía</Text>
              <TextInput value={bio} onChangeText={setBio} multiline placeholder="Escribe tu bio..." className="bg-surface p-4 rounded-2xl border border-border text-foreground h-32" textAlignVertical="top" />
            </View>
          </View>

          {/* Botón Guardar - Solo aquí se sincroniza */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`p-5 rounded-full items-center shadow-lg ${saving ? 'bg-gray-400' : 'bg-primary'}`}
          >
            {saving ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-lg">Guardando en la nube...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">💾 GUARDAR TODO EN LA NUBE</Text>
            )}
          </Pressable>

          <Text className="text-center text-[10px] text-muted">Los cambios se verán en todos los dispositivos al guardar.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
