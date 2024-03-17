import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

type AdvancedGestureProps = {
  onDoubleTap?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
};

const AdvancedGesture = ({
  onDoubleTap,
  onLongPress,
  onTap,
  children,
  style,
}: AdvancedGestureProps) => {
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (onDoubleTap) {
        onDoubleTap();
      }
    })
    .runOnJS(true)
    .enabled(onDoubleTap ? true : false);

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (onTap) {
        onTap();
      }
    })
    .runOnJS(true)
    .enabled(onTap ? true : false);

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      if (onLongPress) {
        onLongPress();
      }
    })
    .runOnJS(true)
    .enabled(onLongPress ? true : false);

  const combinedGesture = Gesture.Exclusive(
    longPressGesture,
    doubleTapGesture,
    tapGesture
  );

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default AdvancedGesture;
