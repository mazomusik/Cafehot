import { View, ViewProps } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface AnimatedCardProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
}

export function AnimatedCard({
  children,
  delay = 0,
  direction = "up",
  ...props
}: AnimatedCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animation = direction === "up" ? FadeInUp : FadeInDown;

  return (
    <Animated.View
      entering={animation.delay(delay).springify()}
      style={animatedStyle}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
