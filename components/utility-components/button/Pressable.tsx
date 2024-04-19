import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import PressableGesture from "./PressableGesture";
import { PressableProps } from "../../../types/component.types";
import { usePressAnimation } from "../../../hooks/utility.hooks";
import { StyleSheet, View } from "react-native";
import { backgroundStyle } from "../../../styles";
import { useCallback } from "react";
import {
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const Pressable = ({
  style,
  enabled,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  hitSlop,
  children,
  animateOnLongPress,
  animateOnPress,
  useUnderlay,
  ...restProps
}: PressableProps) => {
  const isPressed = useSharedValue(false);

  const [animatedStyle, pressCallback, longPressCallback] = usePressAnimation(
    animateOnPress,
    animateOnLongPress,
    onPress,
    onLongPress
  );

  const pressInCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      isPressed.value = true;
      if (onPressIn) {
        onPressIn(event);
      }
    },
    [onPressIn]
  );

  const pressOutCallback = useCallback(
    (
      event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
      success: boolean
    ) => {
      isPressed.value = false;
      if (onPressOut) {
        onPressOut(event, success);
      }
    },
    [onPressOut]
  );

  const onCancel = useCallback(() => {
    isPressed.value = false;
  }, []);

  const underlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isPressed.value ? 1 : 0,
  }));

  return (
    <PressableGesture
      enabled={enabled}
      hitSlop={hitSlop}
      onLongPress={onLongPress ? longPressCallback : undefined}
      onPress={onPress ? pressCallback : undefined}
      onPressIn={pressInCallback}
      onPressOut={pressOutCallback}
      onCancel={onCancel}
    >
      <Animated.View {...restProps} style={[animatedStyle, style]}>
        {useUnderlay && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              backgroundStyle.background_dove_grey,
              underlayAnimatedStyle,
            ]}
          />
        )}
        {children}
      </Animated.View>
    </PressableGesture>
  );
};

export default Pressable;
