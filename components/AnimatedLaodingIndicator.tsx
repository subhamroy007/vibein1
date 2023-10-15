import { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { layoutStyle } from "../styles";
import {
  COLOR_12,
  COLOR_2,
  LOADING_INDICATOR_ANIMATION_1_DURATION,
  LOADING_INDICATOR_ANIMATION_2_DURATION,
  SIZE_2,
  SIZE_36,
} from "../constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AnimatedLaodingIndicatorProps = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedLaodingIndicator({
  size,
  style,
  color,
}: AnimatedLaodingIndicatorProps) {
  const animatedValue1 = useSharedValue(0); //initialize animated value 1

  const animatedValue2 = useSharedValue(0); //initialize animated value 2

  //build the repeat animation as soon as the component loads
  useEffect(() => {
    animatedValue1.value = 0;
    animatedValue2.value = 0;
    animatedValue1.value = withRepeat(
      withTiming(1, {
        duration: LOADING_INDICATOR_ANIMATION_1_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      false
    );
    animatedValue2.value = withRepeat(
      withTiming(1, {
        duration: LOADING_INDICATOR_ANIMATION_2_DURATION,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true
    );
  }, []);

  const indicatorColor = color ? color : COLOR_2;
  const indicatorSize = size ? size : SIZE_36; //intialize the avavtar size
  const strokeWidth = 4 * StyleSheet.hairlineWidth; //intialize stroke width of the svg
  const noOfSection = 8; //intialize the number of outlined sections in the svg
  const portion = 0.5; //initialize the amount of visible storke

  const circumference = Math.PI * (indicatorSize - strokeWidth); //calculate the circumference of the circle
  const section = Math.floor((circumference * portion) / (noOfSection * 2)); //calculate the stroke dash length

  const sectionRotations = [];

  for (let i = 0; i < noOfSection; i++) {
    sectionRotations.push(Math.floor((360 * portion) / noOfSection) * i);
  }

  //style of the first svg
  const animatedSvg1Style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(
              animatedValue1.value,
              [0, 1],
              [0, 360],
              Extrapolate.CLAMP
            ) + "deg",
        },
      ],
    };
  });

  //prop of the second svg circle
  const animatedSvg2Props = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(
        animatedValue2.value,
        [0, 1],
        [0, circumference]
      ),
    };
  });

  return (
    <View style={[style, { width: indicatorSize, height: indicatorSize }]}>
      <AnimatedSvg
        width={indicatorSize}
        height={indicatorSize}
        style={[animatedSvg1Style, layoutStyle.position_absolute]}
        fillOpacity={0}
      >
        {sectionRotations.map((angel) => (
          <Circle
            key={angel}
            stroke={indicatorColor}
            strokeWidth={strokeWidth}
            cx={indicatorSize / 2}
            cy={indicatorSize / 2}
            originX={indicatorSize / 2}
            originY={indicatorSize / 2}
            r={(indicatorSize - strokeWidth) / 2}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - section}
            strokeLinecap="round"
            rotation={angel - 90}
          />
        ))}
      </AnimatedSvg>
      <Svg
        fillOpacity={0}
        width={indicatorSize}
        height={indicatorSize}
        style={styles.svg2}
      >
        <AnimatedCircle
          stroke={indicatorColor}
          strokeWidth={strokeWidth}
          cx={indicatorSize / 2}
          cy={indicatorSize / 2}
          originX={indicatorSize / 2}
          originY={indicatorSize / 2}
          r={(indicatorSize - strokeWidth) / 2}
          strokeDasharray={circumference}
          animatedProps={animatedSvg2Props}
          rotation={-90}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  svg2: {
    transform: [{ rotateY: "180deg" }],
    ...layoutStyle.position_absolute,
  },
});
