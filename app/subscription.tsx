import { ScrollView, Text, View, Pressable, Image, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { profile, subscribe } = useApp();

  const handleCopyBreKey = async () => {
    await Clipboard.setStringAsync(profile.breKey);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copiado", "Llave Bre copiada al portapapeles");
  };

  const handleOpenWhatsApp = () => {
    const message = `Hola, acabo de transferir $${profile.subscriptionPrice.toLocaleString()} COP a tu llave Bre ${profile.breKey}. Por favor activa mi suscripción.`;
    const whatsappUrl = `https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Linking.openURL(`https://web.whatsapp.com/send?phone=${profile.whatsappNumber.replace(/\D/g, "")}&text=${encodeURIComponent(message)}`);
    });
  };

  const handleSubscribeConfirm = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Instrucciones de Pago", `Por favor:\n\n1. Transfiere $${profile.subscriptionPrice.toLocaleString()} COP a la llave Bre: ${profile.breKey}\n\n2. Envía el comprobante por WhatsApp\n\n3. Tu suscripción se activará en minutos`, [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Abrir WhatsApp",
        onPress: handleOpenWhatsApp,
      },
    ]);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Suscripción</Text>
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Profile Summary */}
        <View className="px-4 py-6 items-center gap-4 bg-surface rounded-lg m-4">
          <View className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center overflow-hidden">
            {profile.profilePhoto ? (
              <Image source={{ uri: profile.profilePhoto }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-3xl">👤</Text>
            )}
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">{profile.name}</Text>
            <Text className="text-sm text-muted">{profile.age} años • {profile.city}</Text>
          </View>
        </View>

        {/* Price Section */}
        <View className="px-4 py-6 items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg m-4 border border-primary/20">
          <Text className="text-sm text-muted font-semibold">PRECIO MENSUAL</Text>
          <Text className="text-5xl font-bold text-primary">${profile.subscriptionPrice.toLocaleString()}</Text>
          <Text className="text-xs text-muted">COP por mes</Text>
        </View>

        {/* Payment Instructions */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground mb-2">Instrucciones de Pago</Text>

          {/* Step 1 */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="text-base font-semibold text-foreground flex-1">Transfiere el dinero</Text>
            </View>
            <View className="bg-warning/10 border border-warning rounded-lg p-2 ml-11 mb-2">
              <Text className="text-xs font-bold text-warning">⚠️ IMPORTANTE: LLAVE BRE (no Nequi)</Text>
            </View>
            <Text className="text-sm text-muted ml-11">Transfiere a esta LLAVE BRE:</Text>
            <View className="bg-background rounded-lg p-3 border-2 border-primary ml-11 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xs text-muted font-semibold mb-1">LLAVE BRE</Text>
                <Text className="text-base font-mono font-bold text-foreground">{profile.breKey}</Text>
              </View>
              <Pressable onPress={handleCopyBreKey} className="px-3 py-2 bg-primary rounded-lg">
                <Text className="text-white text-xs font-bold">Copiar</Text>
              </Pressable>
            </View>
          </View>

          {/* Step 2 */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-base font-semibold text-foreground flex-1">Envía el comprobante</Text>
            </View>
            <Text className="text-sm text-muted ml-11">Captura una foto del comprobante y envíalo por WhatsApp a:</Text>
            <Pressable onPress={handleOpenWhatsApp} className="bg-green-500 rounded-lg p-3 ml-11 flex-row items-center justify-center gap-2">
              <Text className="text-xl">💬</Text>
              <Text className="text-white font-bold">Abrir WhatsApp</Text>
            </Pressable>
          </View>

          {/* Step 3 */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-accent items-center justify-center">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="text-base font-semibold text-foreground flex-1">¡Listo!</Text>
            </View>
            <Text className="text-sm text-muted ml-11">Tu suscripción se activará en minutos después de que confirmemos el pago.</Text>
          </View>
        </View>

        {/* Benefits */}
        <View className="px-4 py-6 gap-3">
          <Text className="text-lg font-bold text-foreground mb-2">Beneficios de la Suscripción</Text>
          <View className="gap-2">
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">🔓</Text>
              <Text className="text-sm text-foreground flex-1">Acceso a toda la galería privada</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">📸</Text>
              <Text className="text-sm text-foreground flex-1">Contenido exclusivo de bienvenida</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">💬</Text>
              <Text className="text-sm text-foreground flex-1">Contacto directo por WhatsApp</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">🔄</Text>
              <Text className="text-sm text-foreground flex-1">Actualizaciones de contenido regular</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">🟢</Text>
              <Text className="text-sm text-foreground flex-1">Acceso a transmisiones en vivo</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="px-4 py-6">
          <Pressable
            onPress={handleSubscribeConfirm}
            className="w-full rounded-full py-4 overflow-hidden"
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#8B4BA8" : "#9B59B6",
              },
            ]}
          >
            <Text className="text-center text-white font-bold text-lg">Continuar con la Suscripción</Text>
          </Pressable>
          <Text className="text-center text-xs text-muted mt-3">Al continuar aceptas los términos de suscripción</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
