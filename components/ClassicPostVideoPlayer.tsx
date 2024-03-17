import Animated from "react-native-reanimated";
import { OutdatedVideoParams } from "../types/utility.types";
import { useSpringAnimation } from "../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { layoutStyle } from "../styles";
import { useDeviceLayout } from "../hooks/utility.hooks";
import { AnimatedIcon } from "./Icon";
import { COLOR_6, SIZE_42 } from "../constants";
import RetryableVideo from "./RetryableVideo";
import { useWindowDimensions } from "react-native";

export type ClassicPostVideoPlayerProps = {
  video: OutdatedVideoParams;
  onDoubleTap: () => void;
  onTap: () => void;
  focused: boolean;
};

const ClassicPostVideoPlayer = ({
  onDoubleTap,
  onTap,
  focused,
  video,
}: ClassicPostVideoPlayerProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const {
    animatedStyle: animatedHeartIconStyle,
    startAnimation: startHeartIconAnimation,
  } = useSpringAnimation();

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      startHeartIconAnimation();
      onDoubleTap();
    })
    .runOnJS(true);

  const singleTapGesture = Gesture.Tap()
    .onStart(() => {
      onTap();
    })
    .runOnJS(true);
  const complexGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <GestureDetector gesture={complexGesture}>
      <Animated.View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.flex_1,
          { aspectRatio: "2/3", width: screenWidth },
        ]}
      >
        <RetryableVideo
          focused={focused}
          url={video.url}
          poster={video.thumbnail.url}
          paused={false}
          style={[
            layoutStyle.width_100_percent,
            layoutStyle.height_100_percent,
          ]}
        />
        <AnimatedIcon
          name="heart-solid"
          size={SIZE_42}
          color={COLOR_6}
          style={animatedHeartIconStyle}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ClassicPostVideoPlayer;
