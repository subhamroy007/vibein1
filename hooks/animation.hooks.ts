import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { layoutStyle } from "../styles";
import { useCallback } from "react";

export function useSpringAnimation() {
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

  const startAnimation = useCallback(() => {
    animatedValue.value = withSequence(
      withTiming(1, {
        duration: 50,
        easing: Easing.ease,
      }),
      withTiming(2, {
        duration: 400,
        easing: Easing.elastic(2.5),
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

  return { animatedStyle, startAnimation };
}
