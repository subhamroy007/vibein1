import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { AnimateStyle, runOnJS } from "react-native-reanimated";

type PressEventParams = {
  absoluteX: number;
  absoluteY: number;
  x: number;
  y: number;
};

type PressableProps = {
  onPress?: (event: PressEventParams) => void;
  onLongPress?: (event: PressEventParams) => void;
  tapEnabled?: boolean;
  longPressEnabled?: boolean;
  style?: StyleProp<AnimateStyle<StyleProp<ViewStyle>>>;
  children?: ReactNode;
};

const BasicPressable = ({
  style,
  longPressEnabled,
  onLongPress,
  onPress,
  tapEnabled,
  children,
}: PressableProps) => {
  const tapGesture = Gesture.Tap()
    .onStart(({ absoluteX, absoluteY, x, y }) => {
      if (onPress) {
        onPress({ absoluteX, absoluteY, x, y });
      }
    })
    .runOnJS(true)
    .enabled(onPress ? (tapEnabled !== undefined ? tapEnabled : true) : false);

  const longPressGesture = Gesture.LongPress()
    .onStart(({ absoluteX, absoluteY, x, y }) => {
      if (onLongPress) {
        onLongPress({ absoluteX, absoluteY, x, y });
      }
    })
    .runOnJS(true)
    .enabled(
      onLongPress
        ? longPressEnabled !== undefined
          ? longPressEnabled
          : true
        : false
    );

  const nativeGesture = Gesture.Native().onStart(() => {
    console.log("started");
  });

  const combinedGesture = Gesture.Exclusive(
    nativeGesture,
    tapGesture,
    longPressGesture
  );

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default BasicPressable;
