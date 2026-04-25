import { ScrollView, Text, View, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";

export default function AdminPaymentScreen() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useApp();
  const [breKey, setBreKey] = useState(profile.breKey);
  const [whatsapp, setWhatsapp] = useState(profile.whatsappNumber);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && profile.name !== "Cargando...") {
      setBreKey(profile.breKey);
      setWhatsapp(profile.whatsappNumber);
    }
  }, [loading, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ breKey, whatsappNumber: whatsapp });
      Alert.alert("Éxito", "Métodos de pago actualizados en la nube");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
          <Text className="text-xl font-bold">Métodos de Pago Global</Text>
          <Pressable onPress={() => router.back()}><Text className="text-2xl">✕</Text></Pressable>
        </View>

        <View className="p-4 gap-6">
          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">LLAVE BRE (NÚMERO O EMAIL)</Text>
            <TextInput value={breKey} onChangeText={setBreKey} className="bg-white p-4 rounded-xl border border-border" />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">WHATSAPP DE CONTACTO</Text>
            <TextInput value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" className="bg-white p-4 rounded-xl border border-border" />
          </View>

          <Pressable onPress={handleSave} disabled={saving || loading} className="bg-primary p-4 rounded-full items-center">
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Actualizar en la Nube</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
