import { ReactNode, useCallback } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  PRESSABLE_ANIMATION_DURATION,
  PRESSABLE_ANIMATION_RESET_DURATION,
} from "../constants";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppPressableProps = PressableProps & {
  onPress: () => void;
};

export default function AppPressable({
  children,
  onPress,
  style,
  ...restProps
}: AppPressableProps) {
  const animatedValue = useSharedValue(1);

  const animatedPressableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedValue.value }],
  }));

  const onPressCallback = useCallback(() => {
    onPress();
    animatedValue.value = withSequence(
      withTiming(1.0, {
        duration: PRESSABLE_ANIMATION_RESET_DURATION,
        easing: Easing.ease,
      }),
      withTiming(0.7, {
        duration: PRESSABLE_ANIMATION_DURATION,
        easing: Easing.ease,
      }),
      withTiming(1.0, {
        duration: PRESSABLE_ANIMATION_DURATION,
        easing: Easing.ease,
      })
    );
  }, [onPress]);

  return (
    <AnimatedPressable
      onPress={onPressCallback}
      style={[style, animatedPressableStyle]}
      {...restProps}
    >
      {children}
    </AnimatedPressable>
  );
}
