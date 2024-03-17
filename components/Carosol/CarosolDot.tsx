import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { marginStyle } from "../../styles";
import { StyleSheet } from "react-native";
import { COLOR_1, OCEAN_BLUE, SIZE_2, SIZE_4 } from "../../constants";

export function CarosolDot({
  activeIndex,
  index,
}: {
  index: number;
  activeIndex: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            index === activeIndex
              ? withTiming(1.5, { duration: 300 })
              : withTiming(1, { duration: 300 }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: index === activeIndex ? OCEAN_BLUE : COLOR_1,
        },
        styles.dot,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: SIZE_4,
    height: SIZE_4,
    borderRadius: SIZE_2,
    ...marginStyle.margin_horizontal_2,
  },
});
