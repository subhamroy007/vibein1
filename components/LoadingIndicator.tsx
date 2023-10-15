import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Easing } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type LoadingIndicatorProps = {
  style?: StyleProp<ViewStyle>;
  size?: "small" | "large";
};

export function LoadingIndicator({ style, size }: LoadingIndicatorProps) {
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  let color = "red";

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.linear,
        isInteraction: false,
      })
    ).start();
  }, []);

  let indicatorSize = 0;
  let strokeSize = 4 * StyleSheet.hairlineWidth;
  let circumference = Math.PI * indicatorSize;

  switch (size) {
    case "small":
      indicatorSize = 24;
      break;
    case "large":
    default:
      indicatorSize = 36;
  }

  circumference = Math.PI * (indicatorSize - strokeSize);

  return (
    <AnimatedSvg
      width={indicatorSize}
      height={indicatorSize}
      strokeWidth={strokeSize}
      style={[
        {
          borderRadius: indicatorSize / 2,
          transform: [
            {
              rotateZ: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0 + "deg", 360 + "deg"],
                extrapolate: "clamp",
              }),
            },
          ],
        },
        style,
      ]}
      stroke={color}
      fillOpacity={0}
    >
      <Circle
        cx={indicatorSize / 2}
        cy={indicatorSize / 2}
        r={(indicatorSize - strokeSize) / 2}
        strokeDasharray={circumference}
        strokeOpacity={0.4}
      />
      <Circle
        cx={indicatorSize / 2}
        cy={indicatorSize / 2}
        r={(indicatorSize - strokeSize) / 2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.8}
      />
    </AnimatedSvg>
  );
}
