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

export type SwipablePostPlaceHolderProps = {
  height: number;
  isLoading: boolean;
};

const SwipablePostPlaceHolder = ({
  height,
  isLoading,
}: SwipablePostPlaceHolderProps) => {
  const animatedOpacity = useSharedValue(1);

  useEffect(() => {
    animatedOpacity.value = isLoading
      ? withRepeat(withTiming(0.5, { duration: 800 }), -1, true)
      : 1;
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        { height },
        animatedStyle,
        paddingStyle.padding_12,
        layoutStyle.align_item_flex_start,
      ]}
    >
      <View style={metadata_container_style}>
        <View style={avatar_placeholder_style} />
        <View style={username_placeholder_style} />
      </View>
      <View style={caption_placeholder_style} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  avatar_placeholder: {
    width: SIZE_42,
    height: SIZE_42,
    borderRadius: SIZE_42,
  },
  username_placeholder: {
    height: SIZE_12,
    width: "30%",
    borderRadius: SIZE_12,
  },
  caption_placeholder: {
    height: SIZE_12,
    width: "70%",
    borderRadius: SIZE_12,
  },
});

const avatar_placeholder_style = [
  backgroundStyle.background_color_14,
  styles.avatar_placeholder,
];

const username_placeholder_style = [
  backgroundStyle.background_color_14,
  marginStyle.margin_left_12,
  styles.username_placeholder,
];

const caption_placeholder_style = [
  marginStyle.margin_top_12,
  backgroundStyle.background_color_14,
  styles.caption_placeholder,
];

const metadata_container_style = [
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  marginStyle.margin_top_auto,
];

export default SwipablePostPlaceHolder;
