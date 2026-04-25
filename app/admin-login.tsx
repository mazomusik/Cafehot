import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

const ADMIN_PASSWORD = "27041993";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Por favor ingresa la contraseña");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simular verificación
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push("/admin");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", "Contraseña incorrecta");
        setPassword("");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 justify-center px-6 gap-6">
        {/* Header */}
        <View className="items-center gap-2 mb-6">
          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center">
            <Text className="text-3xl">🔐</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">Panel de Administración</Text>
          <Text className="text-sm text-muted text-center">Ingresa tu contraseña para acceder</Text>
        </View>

        {/* Password Input */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Contraseña</Text>
          <View className="flex-row items-center bg-surface border border-border rounded-lg overflow-hidden">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9CA3AF"
              className="flex-1 px-4 py-3 text-foreground"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="px-4 py-3"
              disabled={loading}
            >
              <Text className="text-xl">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="w-full rounded-full py-4 overflow-hidden"
          style={({ pressed }) => [
            {
              backgroundColor: pressed && !loading ? "#8B4BA8" : "#9B59B6",
              opacity: loading ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-center text-white font-bold text-lg">
            {loading ? "Verificando..." : "Entrar"}
          </Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          onPress={() => router.back()}
          disabled={loading}
          className="w-full rounded-full py-3 border border-border"
        >
          <Text className="text-center text-foreground font-semibold">Cancelar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
