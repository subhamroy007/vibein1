import { StyleSheet, View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SIZE_12, SIZE_42 } from "../../constants";
import { useEffect } from "react";

export default function FullScreenPlaceHolder() {
  const animatedOpacity = useSharedValue(1);

  useEffect(() => {
    animatedOpacity.value = withRepeat(
      withTiming(0.5, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.root_container, animatedStyle]}>
      <View
        style={[layoutStyle.flex_direction_row, layoutStyle.align_item_center]}
      >
        <View style={styles.avatar_placeholder} />
        <View style={styles.username_placeholder} />
      </View>
      <View style={styles.caption_placeholder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatar_placeholder: {
    width: SIZE_42,
    height: SIZE_42,
    borderRadius: SIZE_42 / 2,
    ...backgroundStyle.background_color_14,
  },
  username_placeholder: {
    height: SIZE_12,
    width: "30%",
    ...backgroundStyle.background_color_14,
    ...marginStyle.margin_left_12,
  },
  caption_placeholder: {
    ...marginStyle.margin_top_12,
    ...backgroundStyle.background_color_14,
    height: SIZE_12,
    width: "70%",
  },
  root_container: {
    ...paddingStyle.padding_12,
    ...layoutStyle.justify_content_flex_end,
    ...layoutStyle.width_100_percent,
    ...layoutStyle.height_100_percent,
  },
});
