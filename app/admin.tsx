import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

interface AdminCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
}

const ADMIN_CARDS: AdminCard[] = [
  {
    id: "profile",
    title: "Editar Perfil",
    icon: "👤",
    description: "Foto, nombre, edad, ciudad y descripción",
    route: "/admin-profile",
  },
  {
    id: "gallery",
    title: "Gestionar Galería",
    icon: "🖼️",
    description: "Subir, editar o borrar fotos y videos",
    route: "/admin-gallery",
  },
  {
    id: "subscription",
    title: "Suscripción",
    icon: "💳",
    description: "Cambiar precio y ver suscriptores",
    route: "/admin-subscription",
  },
  {
    id: "payment",
    title: "Métodos de Pago",
    icon: "💰",
    description: "Gestionar Bre, PayPal, cuentas bancarias",
    route: "/admin-payment",
  },
  {
    id: "live",
    title: "Transmisiones en Vivo",
    icon: "🔴",
    description: "Activar/desactivar estado en vivo",
    route: "/admin-live",
  },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { profile } = useApp();

  const handleCardPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Panel Admin</Text>
          <Pressable onPress={handleLogout} className="px-3 py-2 bg-error/10 rounded-lg">
            <Text className="text-error font-semibold text-sm">Salir</Text>
          </Pressable>
        </View>

        {/* Profile Summary */}
        <View className="px-4 py-6 gap-2 bg-surface rounded-lg m-4 border border-border">
          <Text className="text-xs font-semibold text-muted uppercase">Perfil Actual</Text>
          <Text className="text-xl font-bold text-foreground">{profile.name}</Text>
          <Text className="text-sm text-muted">{profile.age} años • {profile.city}</Text>
          <Text className="text-sm text-muted">📊 {profile.subscribers.toLocaleString()} suscriptores</Text>
        </View>

        {/* Admin Cards */}
        <View className="px-4 gap-3 mb-6">
          {ADMIN_CARDS.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => handleCardPress(card.route)}
              className="bg-surface rounded-lg p-4 border border-border flex-row items-center gap-4"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="w-12 h-12 rounded-lg bg-primary/10 items-center justify-center">
                <Text className="text-2xl">{card.icon}</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-base font-bold text-foreground">{card.title}</Text>
                <Text className="text-xs text-muted">{card.description}</Text>
              </View>
              <Text className="text-xl text-muted">›</Text>
            </Pressable>
          ))}
        </View>

        {/* Info Box */}
        <View className="px-4 py-4 bg-warning/10 border border-warning rounded-lg m-4 gap-2">
          <Text className="text-sm font-semibold text-warning">⚠️ Información Importante</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            Los cambios que realices aquí se guardan automáticamente. Asegúrate de que toda la información sea correcta antes de continuar.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
