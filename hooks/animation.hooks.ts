import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { layoutStyle } from "../styles";
import { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";

export function useSpringAnimation(): [
  StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>,
  (value?: number) => void
] {
  const animatedValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value === 1 ? 0 : 1,
      transform: [
        {
          scale: animatedValue.value,
        },
      ],
      ...layoutStyle.position_absolute,
    };
  });

  const startAnimation = useCallback((value: number = 2.5) => {
    animatedValue.value = 1;
    animatedValue.value = withSequence(
      withTiming(2, {
        duration: 400,
        easing: Easing.elastic(value),
      }),
      withDelay(
        800,
        withTiming(1, {
          duration: 100,
          easing: Easing.ease,
        })
      )
    );
  }, []);

  return [animatedStyle, startAnimation];
}
