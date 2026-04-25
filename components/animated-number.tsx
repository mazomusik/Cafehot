import { Text, TextProps } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

interface AnimatedNumberProps extends TextProps {
  value: number;
  duration?: number;
}

export function AnimatedNumber({ value, duration = 1000, ...props }: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [value, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value > 0 ? 1 : 0.5,
    };
  });

  return (
    <Animated.Text entering={FadeIn} style={animatedStyle} {...props}>
      {Math.floor(animatedValue.value).toLocaleString()}
    </Animated.Text>
  );
}
