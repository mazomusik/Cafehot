import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function AdminSubscriptionScreen() {
  const router = useRouter();
  const { profile, updateProfile, updateSubscribers } = useApp();
  const [price, setPrice] = useState(profile.subscriptionPrice.toString());
  const [subscribers, setSubscribers] = useState(profile.subscribers.toString());
  const [saving, setSaving] = useState(false);

  const handleSavePrice = async () => {
    if (!price) {
      Alert.alert("Error", "Por favor ingresa un precio");
      return;
    }

    const newPrice = parseInt(price);
    if (newPrice <= 0) {
      Alert.alert("Error", "El precio debe ser mayor a 0");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateProfile({ subscriptionPrice: newPrice });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Precio actualizado correctamente");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSubscribers = async () => {
    if (!subscribers) {
      Alert.alert("Error", "Por favor ingresa un número de suscriptores");
      return;
    }

    const newCount = parseInt(subscribers);
    if (newCount < 0) {
      Alert.alert("Error", "El número de suscriptores no puede ser negativo");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateSubscribers(newCount);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Contador de suscriptores actualizado");
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
          <Text className="text-xl font-bold text-foreground">Suscripción</Text>
          <Pressable onPress={() => router.back()} disabled={saving} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Current Price */}
        <View className="px-4 py-6 gap-4">
          <View className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 items-center gap-2 border border-primary/20">
            <Text className="text-sm text-muted font-semibold">PRECIO ACTUAL</Text>
            <Text className="text-5xl font-bold text-primary">${profile.subscriptionPrice.toLocaleString()}</Text>
            <Text className="text-xs text-muted">COP por mes</Text>
          </View>
        </View>

        {/* Change Price */}
        <View className="px-4 py-6 gap-4 border-b border-border">
          <Text className="text-lg font-bold text-foreground">Cambiar Precio</Text>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nuevo Precio (COP)</Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg overflow-hidden">
              <Text className="px-4 py-3 text-foreground font-bold">$</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="8000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                className="flex-1 px-2 py-3 text-foreground"
                editable={!saving}
              />
            </View>
          </View>

          <Pressable
            onPress={handleSavePrice}
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
              {saving ? "Guardando..." : "Actualizar Precio"}
            </Text>
          </Pressable>
        </View>

        {/* Subscribers Section */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Suscriptores</Text>

          <View className="bg-surface rounded-lg p-6 items-center gap-2 border border-border">
            <Text className="text-sm text-muted font-semibold">TOTAL ACTUAL</Text>
            <Text className="text-5xl font-bold text-primary">{profile.subscribers.toLocaleString()}</Text>
            <Text className="text-xs text-muted mt-2">Edita el número abajo para cambiar</Text>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Número de Suscriptores</Text>
            <TextInput
              value={subscribers}
              onChangeText={setSubscribers}
              placeholder="8352"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable={!saving}
            />
            <Text className="text-xs text-muted">Puedes cambiar este número en cualquier momento</Text>
          </View>

          <Pressable
            onPress={handleSaveSubscribers}
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
              {saving ? "Guardando..." : "Actualizar Suscriptores"}
            </Text>
          </Pressable>
        </View>

        {/* Info */}
        <View className="px-4 py-4 bg-secondary/10 border border-secondary rounded-lg m-4 gap-2">
          <Text className="text-sm font-semibold text-secondary">ℹ️ Información</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            • El precio se aplica a todos los nuevos suscriptores{"\n"}
            • El contador de suscriptores aumenta automáticamente cuando alguien se suscribe{"\n"}
            • Puedes ajustar manualmente el número de suscriptores en cualquier momento
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
