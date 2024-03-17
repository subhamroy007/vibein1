import { View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { SIZE_12, SIZE_24, SIZE_54, SIZE_70 } from "../../constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function EntityListPlaceholder({
  isLoading,
}: {
  isLoading: boolean;
}) {
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
    <Animated.View style={animatedStyle}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(
        (item) => (
          <View
            key={item}
            style={[
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
              paddingStyle.padding_horizontal_12,
              { height: SIZE_70 },
            ]}
          >
            <View
              style={[
                { width: SIZE_54, height: SIZE_54, borderRadius: SIZE_54 },
                backgroundStyle.background_dove_grey,
              ]}
            />
            <View style={[marginStyle.margin_left_9, layoutStyle.flex_1]}>
              <View
                style={[
                  { width: "50%", height: SIZE_12, borderRadius: SIZE_24 },
                  backgroundStyle.background_dove_grey,
                ]}
              />
              <View
                style={[
                  { width: "70%", height: SIZE_12, borderRadius: SIZE_24 },
                  marginStyle.margin_top_9,
                  backgroundStyle.background_dove_grey,
                ]}
              />
            </View>
          </View>
        )
      )}
    </Animated.View>
  );
}
