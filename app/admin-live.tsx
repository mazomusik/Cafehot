import { ScrollView, Text, View, Pressable, Switch, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function AdminLiveScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [isLive, setIsLive] = useState(profile.isLive);
  const [lastLiveTime, setLastLiveTime] = useState(profile.lastLiveTime || "");
  const [saving, setSaving] = useState(false);

  const handleToggleLive = async () => {
    const newIsLive = !isLive;
    setIsLive(newIsLive);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSaving(true);
    try {
      await updateProfile({ isLive: newIsLive });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo guardar los cambios");
      setIsLive(!newIsLive);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLastLiveTime = async () => {
    if (!lastLiveTime) {
      Alert.alert("Error", "Por favor ingresa la fecha de la última transmisión");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateProfile({ lastLiveTime });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Última transmisión actualizada");
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
          <Text className="text-xl font-bold text-foreground">Transmisiones en Vivo</Text>
          <Pressable onPress={() => router.back()} disabled={saving} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Current Live Status */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Estado Actual</Text>

          <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground">Estoy en vivo ahora</Text>
              <Text className="text-xs text-muted">
                {isLive ? "🟢 Los clientes ven que estás transmitiendo" : "⚫ No estás en vivo"}
              </Text>
            </View>
            <Switch
              value={isLive}
              onValueChange={handleToggleLive}
              disabled={saving}
              trackColor={{ false: "#E5E7EB", true: "#22C55E" }}
              thumbColor={isLive ? "#86EFAC" : "#D1D5DB"}
            />
          </View>

          {isLive && (
            <View className="bg-success/10 border border-success rounded-lg p-3 gap-1">
              <Text className="text-sm font-semibold text-success">🟢 EN VIVO</Text>
              <Text className="text-xs text-foreground">
                Tus clientes verán un banner verde que dice "EN VIVO AHORA" en la pantalla principal. Solo los suscriptores pueden ver la transmisión.
              </Text>
            </View>
          )}
        </View>

        {/* Last Live Time */}
        <View className="px-4 py-6 gap-4 border-t border-border">
          <Text className="text-lg font-bold text-foreground">Última Transmisión</Text>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">¿Cuándo fue tu última transmisión?</Text>
            <TextInput
              value={lastLiveTime}
              onChangeText={setLastLiveTime}
              placeholder="Ej: Hoy a las 8 PM"
              placeholderTextColor="#9CA3AF"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving}
            />
            <Text className="text-xs text-muted">Esto se mostrará en tu perfil para que los clientes sepan cuándo fue tu último live</Text>
          </View>

          <Pressable
            onPress={handleSaveLastLiveTime}
            disabled={saving}
            className="w-full rounded-full py-3 bg-primary overflow-hidden"
            style={({ pressed }) => [
              {
                backgroundColor: pressed && !saving ? "#8B4BA8" : "#9B59B6",
                opacity: saving ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-white font-bold text-sm">
              {saving ? "Guardando..." : "Guardar Última Transmisión"}
            </Text>
          </Pressable>
        </View>

        {/* Info */}
        <View className="px-4 py-4 bg-info/10 border border-secondary rounded-lg m-4 gap-2">
          <Text className="text-sm font-semibold text-secondary">ℹ️ Cómo funciona</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            • Cuando activas "Estoy en vivo ahora", aparece un banner VERDE en la pantalla principal que dice "EN VIVO AHORA"{"\n"}
            • El campo "Última Transmisión" muestra cuándo fue tu último live en el perfil{"\n"}
            • Solo tú puedes controlar esto desde este panel
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
