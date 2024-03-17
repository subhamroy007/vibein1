import { PressableIconProps } from "../../../types/component.types";
import { AnimatedIcon } from "../icon/Icon";
import PressableGesture from "./PressableGesture";
import { usePressAnimation } from "../../../hooks/utility.hooks";

const PressableIcon = ({
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
}: PressableIconProps) => {
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
      <AnimatedIcon {...restProps} style={[style, animatedStyle]} />
    </PressableGesture>
  );
};

export default PressableIcon;
