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
import {
  LINE_WIDTH,
  LOADING_INDICATOR_ANIMATION_1_DURATION,
  LOADING_INDICATOR_ANIMATION_2_DURATION,
  LOGO_BLUE,
  LOGO_GREEN,
  SIZE_48,
} from "../../constants";
import { layoutStyle } from "../../styles";
import Avatar, { AvatarProps } from "../Avatar";
import Pressable from "./button/Pressable";
import { useEffect } from "react";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import { PixelRatio, StyleSheet, View } from "react-native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type OutlinedAvatarProps = {
  outlineWidth?: number;
  gapWidth?: number;
  animateOutline?: boolean;
} & AvatarProps;

export default function OutlinedAvatar({
  url,
  size,
  style,
  gapWidth,
  outlineWidth,
  animateOutline,
}: OutlinedAvatarProps) {
  const animatedValue1 = useSharedValue(0); //initialize animated value 1

  const animatedValue2 = useSharedValue(0); //initialize animated value 2

  const calculatedSize = size ? size : SIZE_48;

  const calculatedOutlineWidth = outlineWidth
    ? LINE_WIDTH * outlineWidth
    : 6 * LINE_WIDTH;

  const calculatedAvatarSize =
    calculatedSize -
    2 * (gapWidth ? LINE_WIDTH * gapWidth : 5 * LINE_WIDTH) -
    2 * calculatedOutlineWidth;

  const noOfSection = 8; //intialize the number of outlined sections in the svg
  const portion = 0.5; //initialize the amount of visible storke

  const circumference = Math.PI * (calculatedSize - calculatedOutlineWidth); //calculate the circumference of the circle
  const section = Math.floor((circumference * portion) / (noOfSection * 2)); //calculate the stroke dash length
  const radius = PixelRatio.roundToNearestPixel(
    (calculatedSize - calculatedOutlineWidth) / 2
  );

  const sectionRotations = [];

  for (let i = 0; i < noOfSection; i++) {
    sectionRotations.push(Math.floor((360 * portion) / noOfSection) * i);
  }

  //build the repeat animation as soon as the component loads
  useEffect(() => {
    if (animateOutline) {
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
    } else {
      animatedValue1.value = 0;
      animatedValue2.value = 0;
    }
  }, [animateOutline]);

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
  }, []);

  //prop of the second svg circle
  const animatedSvg2Props = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(
        animatedValue2.value,
        [0, 1],
        [0, circumference]
      ),
    };
  }, []);

  return (
    <View
      style={[
        { width: calculatedSize, aspectRatio: 1 },
        layoutStyle.content_center,
        style,
      ]}
    >
      <Avatar url={url} size={calculatedAvatarSize} />
      {animateOutline && (
        <AnimatedSvg
          width={calculatedSize}
          height={calculatedSize}
          style={[animatedSvg1Style, layoutStyle.position_absolute]}
          fillOpacity={0}
        >
          {sectionRotations.map((angel) => (
            <AnimatedCircle
              key={angel}
              stroke={LOGO_BLUE}
              strokeWidth={calculatedOutlineWidth}
              cx={calculatedSize / 2}
              cy={calculatedSize / 2}
              originX={calculatedSize / 2}
              originY={calculatedSize / 2}
              r={(calculatedSize - calculatedOutlineWidth) / 2}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - section}
              strokeLinecap="round"
              rotation={angel - 90}
            />
          ))}
        </AnimatedSvg>
      )}
      <Svg
        fillOpacity={0}
        width={calculatedSize}
        height={calculatedSize}
        style={[styles.svg2]}
      >
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={LOGO_GREEN} />
            <Stop offset="100%" stopColor={LOGO_BLUE} />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          stroke={`url(#grad)`}
          strokeWidth={calculatedOutlineWidth}
          cx={calculatedSize / 2}
          cy={calculatedSize / 2}
          originX={calculatedSize / 2}
          originY={calculatedSize / 2}
          r={radius}
          strokeDasharray={circumference}
          animatedProps={animatedSvg2Props}
          rotation={-90}
          strokeLinecap={"round"}
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
