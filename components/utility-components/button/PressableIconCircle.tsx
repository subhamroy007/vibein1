import { PressableIconCircleProps } from "../../../types/component.types";
import PressableGesture from "./PressableGesture";
import { usePressAnimation } from "../../../hooks/utility.hooks";
import { AnimatedIconCircle } from "../icon/IconCircle";

const PressableIconCircle = ({
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
}: PressableIconCircleProps) => {
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
      <AnimatedIconCircle {...restProps} style={[style, animatedStyle]} />
    </PressableGesture>
  );
};

export default PressableIconCircle;
