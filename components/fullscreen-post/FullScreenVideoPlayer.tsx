import Animated, { runOnJS } from "react-native-reanimated";
import { layoutStyle } from "../../styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AnimatedIcon } from "../Icon";
import {
  COLOR_14,
  COLOR_15,
  COLOR_2,
  COLOR_3,
  COLOR_6,
  COLOR_8,
  COLOR_9,
  SIZE_36,
  SIZE_42,
} from "../../constants";
import RoundIcon from "../RoundIcon";
import { PostMomentVideoParams } from "../../types/utility.types";
import { ResizeMode, Video } from "expo-av";
import { useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import RetryableImage from "../RetryableImage";
import { StyleSheet } from "react-native";
import { ThunkState } from "../../types/store.types";
import { LinearGradient } from "expo-linear-gradient";
import RetryableVideo from "../RetryableVideo";

export type FullScreenVideoPlayerProps = {
  video: PostMomentVideoParams;
  onDoubleTap: () => void;
  focused: boolean;
};

export default function FullScreenVideoPlayer({
  onDoubleTap,
  ...restProps
}: FullScreenVideoPlayerProps) {
  const [videoPaused, setVideoPaused] = useState(false);

  const {
    animatedStyle: animatedHeartIconStyle,
    startAnimation: startHeartIconAnimation,
  } = useSpringAnimation();

  const {
    animatedStyle: animatedPlaybackIconStyle,
    startAnimation: startPlaybackIconAnimation,
  } = useSpringAnimation();

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      startHeartIconAnimation();
      onDoubleTap();
    })
    .enabled(restProps.focused)
    .runOnJS(true);

  const singleTapGesture = Gesture.Tap()
    .onStart(() => {
      setVideoPaused((prevState) => !prevState);
      startPlaybackIconAnimation();
    })
    .enabled(restProps.focused)
    .runOnJS(true);
  const complexGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <GestureDetector gesture={complexGesture}>
      <Animated.View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.flex_1,
        ]}
      >
        <RetryableVideo
          {...restProps}
          paused={videoPaused}
          style={[
            layoutStyle.width_100_percent,
            layoutStyle.height_100_percent,
          ]}
        />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={[COLOR_8, COLOR_15]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 1]}
        />

        <AnimatedIcon
          name="heart-solid"
          size={SIZE_42}
          color={COLOR_6}
          style={animatedHeartIconStyle}
        />
        <RoundIcon
          name={videoPaused ? "pause" : "play-solid"}
          hideOutline
          backgroundColor={COLOR_9}
          style={animatedPlaybackIconStyle}
          size={SIZE_36}
        />
      </Animated.View>
    </GestureDetector>
  );
}
