import { memo, useEffect } from "react";
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
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  COLOR_2,
  LINE_WIDTH,
  LOADING_INDICATOR_ANIMATION_1_DURATION,
  LOADING_INDICATOR_ANIMATION_2_DURATION,
  LOGO_BLUE,
  LOGO_GREEN,
  SIZE_48,
} from "../../constants";
import { layoutStyle } from "../../styles";
import { shallowEqual } from "react-redux";
import AnimatedCircle from "./AnimatedCircle";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AnimatedLaodingIndicatorProps = {
  size?: number;
  color?: string;
  outlineWidth?: number;
  style?: StyleProp<ViewStyle>;
};

const AnimatedLaodingIndicator = ({
  size,
  style,
  color,
  outlineWidth,
}: AnimatedLaodingIndicatorProps) => {
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

  const indicatorColor = color
    ? color === "grad"
      ? `url(#grad)`
      : color
    : COLOR_2;
  const indicatorSize = size ? size : SIZE_48; //intialize the avavtar size
  const strokeWidth = outlineWidth ? outlineWidth * LINE_WIDTH : 4 * LINE_WIDTH; //intialize stroke width of the svg
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
    <AnimatedSvg
      width={indicatorSize}
      height={indicatorSize}
      style={[
        animatedSvg1Style,
        style,
        {
          width: indicatorSize,
          height: indicatorSize,
        },
      ]}
      fillOpacity={0}
    >
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={LOGO_GREEN} />
          <Stop offset="100%" stopColor={LOGO_BLUE} />
        </LinearGradient>
      </Defs>
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
        rotation={90}
      />
    </AnimatedSvg>
  );
};

const styles = StyleSheet.create({
  svg2: {
    transform: [{ rotateY: "180deg" }],
    ...layoutStyle.position_absolute,
  },
});

/**
 *  <Svg
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
          rotation={90}
        />
      </Svg>
 */

export default memo(AnimatedLaodingIndicator, (prev, next) =>
  shallowEqual(prev, next)
);
