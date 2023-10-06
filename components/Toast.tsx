import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";
import AppText from "./AppText";
import { COLOR_1, HEIGHT_SCALE_2 } from "../constants";
import { useAppSelector } from "../hooks/storeHooks";
import { selectToasterMsg } from "../store/client/client.selector";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Toast() {
  const animatedValue = useSharedValue(0);

  const msg = useAppSelector(selectToasterMsg);

  useEffect(() => {
    if (msg) {
      animatedValue.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 200 }),
        withDelay(1000, withTiming(0, { duration: 400 }))
      );
    }
  }, [msg]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
    };
  });

  if (!msg) {
    return null;
  }

  return (
    <Animated.View
      style={[
        { bottom: HEIGHT_SCALE_2 },
        borderStyle.border_radius_6,
        backgroundStyle.background_color_9,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_9,
        animatedStyle,
        layoutStyle.position_absolute,
        layoutStyle.align_self_center,
      ]}
    >
      {msg && <AppText color={COLOR_1}>{msg.text}</AppText>}
    </Animated.View>
  );
}
