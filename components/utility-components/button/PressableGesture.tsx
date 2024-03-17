import { useCallback, useRef } from "react";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { PressableGestureProps } from "../../../types/component.types";

const PressableGesture = ({
  onLongPress,
  onPress,
  onPressIn,
  onPressOut,
  children,
  hitSlop,
  enabled,
}: PressableGestureProps) => {
  const longPressActivated = useRef(false);

  const pressInCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      longPressActivated.current = false;
      if (onPressIn && onPress) {
        onPressIn(event);
      }
    },
    [onPressIn, onPress]
  );

  const pressOutCallback = useCallback(
    (
      event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
      success: boolean
    ) => {
      if (onPressOut && event.state !== 3) {
        onPressOut(event, success);
      }
    },
    [onPressOut]
  );

  const pressCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (onPress) {
        onPress(event);
      }
    },
    [onPress]
  );

  const longPressInCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      longPressActivated.current = false;
      if (onPressIn && !onPress) {
        onPressIn(event);
      }
    },
    [onPressIn, onPress]
  );

  const longPressOutCallback = useCallback(
    (
      event: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
      success: boolean
    ) => {
      if (onPressOut && longPressActivated.current) {
        onPressOut(event, success);
      }
    },
    [onPressOut]
  );

  const longPressCallback = useCallback(
    (event: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>) => {
      if (onLongPress) {
        longPressActivated.current = true;
        onLongPress(event);
      }
    },
    [onLongPress]
  );

  const pressGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(pressCallback)
    .onBegin(pressInCallback)
    .onFinalize(pressOutCallback)
    .enabled(onPress && enabled !== false ? true : false)
    .hitSlop(hitSlop ? hitSlop : {});

  const longPressGesture = Gesture.LongPress()
    .onStart(longPressCallback)
    .onBegin(longPressInCallback)
    .onFinalize(longPressOutCallback)
    .enabled(onLongPress && enabled !== false ? true : false)
    .hitSlop(hitSlop ? hitSlop : {});

  const combinedGesture = Gesture.Exclusive(longPressGesture, pressGesture);

  return (
    <GestureDetector gesture={combinedGesture}>{children}</GestureDetector>
  );
};

export default PressableGesture;
