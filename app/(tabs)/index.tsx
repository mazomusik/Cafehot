import { ScrollView, Text, View, Pressable, Image, Linking } from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { GalleryGrid } from "@/components/gallery-grid";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { AnimatedNumber } from "@/components/animated-number";

const ADMIN_TOUCH_THRESHOLD = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { profile, gallery } = useApp();
  const profilePhotoTapCount = useRef(0);
  const [tapTimeout, setTapTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleProfilePhotoTap = () => {
    profilePhotoTapCount.current += 1;
    if (tapTimeout) clearTimeout(tapTimeout);
    if (profilePhotoTapCount.current === ADMIN_TOUCH_THRESHOLD) {
      profilePhotoTapCount.current = 0;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/admin-login");
      return;
    }
    const timeout = setTimeout(() => { profilePhotoTapCount.current = 0; }, 1000);
    setTapTimeout(timeout);
  };

  const handleSubscribePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/subscription");
  };

  const handleWhatsAppPress = () => {
    const message = "Hola, me interesa tu contenido exclusivo";
    const whatsappUrl = `https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl);
  };

  return (
    <ScreenContainer className="bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Foto de Portada - Tamaño Restaurado (Elegante) */}
        <View className="relative w-full h-52 bg-gray-200">
          {profile.coverPhoto ? (
            <Image source={{ uri: profile.coverPhoto }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-purple-100" />
          )}

          {/* Foto de Perfil - Centrada y con sombra */}
          <Pressable onPress={handleProfilePhotoTap} className="absolute -bottom-12 left-4 z-10">
            <View className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 shadow-xl overflow-hidden">
              {profile.profilePhoto ? (
                <Image source={{ uri: profile.profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="w-full h-full bg-purple-500 items-center justify-center">
                  <Text className="text-white text-3xl font-bold">👤</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        {/* Info del Perfil - Ajustada al nuevo diseño */}
        <View className="px-4 pb-6 pt-14">
          <View className="gap-1 mb-4">
            <Text className="text-2xl font-bold text-gray-900">{profile.name}</Text>
            <Text className="text-sm text-gray-500">
              {profile.age} años • {profile.city}
            </Text>
            <Text className="text-xs text-gray-400 mt-1 font-bold">
              📊 <AnimatedNumber value={profile.subscribers} /> SUSCRIPTORES
            </Text>
          </View>

          <Text className="text-sm text-gray-700 mb-6 leading-relaxed">{profile.bio}</Text>

          {/* Botones de Acción */}
          <View className="gap-3">
            <Pressable onPress={handleSubscribePress} className="w-full bg-purple-600 rounded-2xl py-4 items-center shadow-md">
              <Text className="text-white font-bold text-base">
                Suscribirme por ${profile.subscriptionPrice.toLocaleString()} COP/mes
              </Text>
            </Pressable>

            <Pressable onPress={handleWhatsAppPress} className="w-full bg-green-500 rounded-2xl py-3 flex-row items-center justify-center gap-2">
              <Text className="text-lg">💬</Text>
              <Text className="text-white font-bold">Contactar por WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        {/* Galería Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Galería Exclusiva</Text>
          <GalleryGrid items={gallery} isSubscribed={false} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
