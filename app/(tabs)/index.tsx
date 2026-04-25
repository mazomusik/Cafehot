import { ScrollView, Text, View, Pressable, Image, Linking, FlatList } from "react-native";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { GalleryGrid } from "@/components/gallery-grid";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { AnimatedNumber } from "@/components/animated-number";

const ADMIN_TOUCH_THRESHOLD = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { profile, gallery, subscribe } = useApp();
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

    const timeout = setTimeout(() => {
      profilePhotoTapCount.current = 0;
    }, 1000);

    setTapTimeout(timeout);
  };

  const handleSubscribePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/subscription");
  };

  const handleWhatsAppPress = () => {
    const message = "Hola, me interesa tu contenido exclusivo";
    const whatsappUrl = `https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Linking.openURL(
        `https://web.whatsapp.com/send?phone=${profile.whatsappNumber.replace(/\D/g, "")}&text=${encodeURIComponent(message)}`
      );
    });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Cover Photo with Profile Photo Overlay - Facebook Style */}
        <View className="relative w-full h-56 bg-gradient-to-b from-primary to-accent overflow-visible">
          {/* Cover Photo */}
          <View className="w-full h-full">
            {profile.coverPhoto ? (
              <Image source={{ uri: profile.coverPhoto }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent" />
            )}
          </View>

          {/* Profile Photo - Left Bottom Corner (Overlaid) */}
          <Pressable onPress={handleProfilePhotoTap} className="absolute bottom-0 left-4 z-10">
            <View className="w-28 h-28 rounded-full border-4 border-white bg-surface shadow-lg overflow-hidden">
              {profile.profilePhoto ? (
                <Image source={{ uri: profile.profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="w-full h-full bg-gradient-to-br from-primary to-accent items-center justify-center">
                  <Text className="text-white text-3xl font-bold">👤</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        {/* Profile Info Section */}
        <View className="px-4 pb-6 pt-6">
          {/* Profile Name, Age, City */}
          <View className="gap-1 mb-4">
            <Text className="text-3xl font-bold text-foreground">{profile.name}</Text>
            <Text className="text-base text-muted">
              {profile.age} años • {profile.city}
            </Text>
            <Text className="text-sm text-muted mt-1">
              📊 <AnimatedNumber value={profile.subscribers} className="text-sm text-muted" /> suscriptores
            </Text>
          </View>

          {/* Bio */}
          <Text className="text-sm text-foreground mb-4 leading-relaxed">{profile.bio}</Text>

          {/* Live Banner */}
          {profile.isLive && (
            <View className="bg-success rounded-lg p-3 mb-4 flex-row items-center gap-2 border border-success">
              <Text className="text-lg">🟢</Text>
              <View className="flex-1">
                <Text className="text-white font-bold text-sm">EN VIVO AHORA</Text>
                <Text className="text-white/80 text-xs">Suscribete para ver la transmision</Text>
              </View>
            </View>
          )}

          {/* Last Live Time */}
          {profile.lastLiveTime && !profile.isLive && (
            <View className="bg-secondary/10 rounded-lg p-3 mb-4 flex-row items-center gap-2 border border-secondary">
              <Text className="text-lg">📺</Text>
              <View className="flex-1">
                <Text className="text-secondary font-bold text-sm">Última transmisión</Text>
                <Text className="text-secondary/80 text-xs">{profile.lastLiveTime}</Text>
              </View>
            </View>
          )}

          {/* Subscribe Button */}
          <Pressable
            onPress={handleSubscribePress}
            className="w-full rounded-full py-4 overflow-hidden mb-4 px-4"
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#8B4BA8" : "#9B59B6",
              },
            ]}
          >
            <Text className="text-center text-white font-bold text-base" numberOfLines={2} adjustsFontSizeToFit>
              Suscribirme por ${profile.subscriptionPrice.toLocaleString()} COP/mes
            </Text>
          </Pressable>

          {/* WhatsApp Button */}
          <Pressable
            onPress={handleWhatsAppPress}
            className="w-full rounded-full py-3 bg-green-500 overflow-hidden flex-row items-center justify-center gap-2"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-lg">💬</Text>
            <Text className="text-center text-white font-bold">Contactar por WhatsApp</Text>
          </Pressable>
        </View>

        {/* Gallery Section */}
        <View className="px-4 py-6">
          <Text className="text-xl font-bold text-foreground mb-4">Galería</Text>
          <GalleryGrid items={gallery} isSubscribed={false} />
        </View>
      </ScrollView>


    </ScreenContainer>
  );
}
