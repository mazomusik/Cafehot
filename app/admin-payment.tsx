import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function AdminPaymentScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [breKey, setBreKey] = useState(profile.breKey);
  const [whatsapp, setWhatsapp] = useState(profile.whatsappNumber);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!breKey || !whatsapp) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateProfile({
        breKey,
        whatsappNumber: whatsapp,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Métodos de pago actualizados");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Métodos de Pago</Text>
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Bre Key */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Llave Bre</Text>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Llave Bre</Text>
            <TextInput
              value={breKey}
              onChangeText={setBreKey}
              placeholder="Ej: 8248086081 o usuario@bre"
              placeholderTextColor="#9CA3AF"
              keyboardType="default"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving}
            />
            <Text className="text-xs text-muted">Puede ser número, usuario o email. Los clientes transferirán a esta llave</Text>
          </View>

          <View className="bg-success/10 border border-success rounded-lg p-3 gap-1">
            <Text className="text-xs font-semibold text-success">✓ Método Activo</Text>
            <Text className="text-xs text-foreground">Los clientes pueden transferir a esta llave</Text>
          </View>
        </View>

        {/* WhatsApp */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">WhatsApp de Contacto</Text>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Número de WhatsApp</Text>
            <TextInput
              value={whatsapp}
              onChangeText={setWhatsapp}
              placeholder="Ej: +57 300 1234567"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving}
            />
            <Text className="text-xs text-muted">Número donde recibirás los comprobantes de pago</Text>
          </View>

          <View className="bg-success/10 border border-success rounded-lg p-3 gap-1">
            <Text className="text-xs font-semibold text-success">✓ Método Activo</Text>
            <Text className="text-xs text-foreground">Los clientes pueden contactarte por aquí</Text>
          </View>
        </View>

        {/* Other Methods Info */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Otros Métodos</Text>

          <View className="gap-3">
            <View className="bg-surface rounded-lg p-4 border border-border opacity-50">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🏦</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">PayPal</Text>
                  <Text className="text-xs text-muted">Próximamente</Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border opacity-50">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">💳</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Transferencia Bancaria</Text>
                  <Text className="text-xs text-muted">Próximamente</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 py-6 gap-3">
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="w-full rounded-full py-4 overflow-hidden"
            style={({ pressed }) => [
              {
                backgroundColor: pressed && !saving ? "#8B4BA8" : "#9B59B6",
                opacity: saving ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-white font-bold text-lg">
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            disabled={saving}
            className="w-full rounded-full py-3 border border-border"
          >
            <Text className="text-center text-foreground font-semibold">Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
