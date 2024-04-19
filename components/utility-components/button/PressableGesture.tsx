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
  onCancel,
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
      if (event.state !== 3) {
        if (onPressOut) {
          onPressOut(event, success);
        }
      } else if (onCancel) {
        onCancel();
      }
    },
    [onPressOut, onCancel]
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
      if (longPressActivated.current) {
        if (onPressOut) {
          onPressOut(event, success);
        }
      } else if (onCancel) {
        onCancel();
      }
    },
    [onPressOut, onCancel]
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
    .maxDuration(onLongPress ? 290 : 30_000)
    .numberOfTaps(1)
    .onStart(pressCallback)
    .onBegin(pressInCallback)
    .onFinalize(pressOutCallback)
    .enabled(onPress && enabled !== false ? true : false)
    .hitSlop(hitSlop ? hitSlop : {});

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
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
