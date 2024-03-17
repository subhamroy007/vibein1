import Animated from "react-native-reanimated";
import PressableGesture from "./PressableGesture";
import { PressableProps } from "../../../types/component.types";
import { usePressAnimation } from "../../../hooks/utility.hooks";

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
  ...restProps
}: PressableProps) => {
  const [animatedStyle, pressCallback, longPressCallback] = usePressAnimation(
    animateOnPress,
    animateOnLongPress,
    onPress,
    onLongPress
  );

  return (
    <PressableGesture
      enabled={enabled}
      hitSlop={hitSlop}
      onLongPress={onLongPress ? longPressCallback : undefined}
      onPress={onPress ? pressCallback : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View {...restProps} style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </PressableGesture>
  );
};

export default Pressable;
