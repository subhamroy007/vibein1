import Video from "../Video";
import { PostVideoParams } from "../../types/utility.types";
import { useCallback, useEffect, useState } from "react";
import { layoutStyle } from "../../styles";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import {
  COLOR_15,
  COLOR_3,
  COLOR_6,
  COLOR_8,
  SIZE_36,
  SIZE_45,
} from "../../constants";
import { AnimatedIconCircle } from "../utility-components/icon/IconCircle";
import Pressable from "../utility-components/button/Pressable";
import { AnimatedIcon } from "../utility-components/icon/Icon";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

type MomentVideoPlayerProps = {
  focused: boolean;
  preload: boolean;
  onDoubleTap: () => void;
} & PostVideoParams;

const MomentVideoPlayer = ({
  focused,
  preload,
  onDoubleTap,
  poster,
  uri,
}: MomentVideoPlayerProps) => {
  const [paused, setPaused] = useState(false);

  const [animatedPlayStyle, startPlayAnimation] = useSpringAnimation();

  const [animatedHeartStyle, startHeartAnimation] = useSpringAnimation();

  useEffect(() => {
    return () => {
      if (!focused) {
        setPaused(false);
      }
    };
  }, [focused]);

  const tapCallback = useCallback(() => {
    startPlayAnimation(1);
    setPaused((value) => !value);
  }, []);

  const doubleTapCallback = useCallback(() => {
    startHeartAnimation();
    onDoubleTap();
  }, [onDoubleTap]);

  const tapGesture = Gesture.Tap().onStart(tapCallback).runOnJS(true);
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(doubleTapCallback)
    .runOnJS(true);

  const combinedGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={root_container_style}>
        <Video
          uri={uri}
          poster={poster}
          preload={preload}
          focused={focused}
          style={layoutStyle.fill}
          paused={paused}
          repeat
        />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={[COLOR_8, COLOR_8, COLOR_15]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.6, 1]}
        />
        <AnimatedIconCircle
          name={paused ? "pause" : "play"}
          size={SIZE_36}
          solid
          backgroundColor={COLOR_3}
          style={animatedPlayStyle}
        />
        <AnimatedIcon
          style={animatedHeartStyle}
          name={"heart-solid"}
          color={COLOR_6}
          size={SIZE_45}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const root_container_style = [
  layoutStyle.flex_fill,
  layoutStyle.content_center,
];

export default MomentVideoPlayer;
