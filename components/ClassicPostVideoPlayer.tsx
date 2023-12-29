import Animated from "react-native-reanimated";
import { PostMomentVideoParams } from "../types/utility.types";
import { useSpringAnimation } from "../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { layoutStyle } from "../styles";
import { useDeviceLayout } from "../hooks/utility.hooks";
import { AnimatedIcon } from "./Icon";
import { COLOR_6, SIZE_42 } from "../constants";
import RetryableVideo from "./RetryableVideo";

export type ClassicPostVideoPlayerProps = {
  video: PostMomentVideoParams;
  onDoubleTap: () => void;
  onTap: () => void;
  focused: boolean;
};

const ClassicPostVideoPlayer = ({
  onDoubleTap,
  onTap,
  ...restProps
}: ClassicPostVideoPlayerProps) => {
  const { width: screenWidth } = useDeviceLayout();

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
        <RetryableVideo {...restProps} paused={false} />
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
